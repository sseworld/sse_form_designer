"use server";

import { Form, FormSubmission } from "@/schemas/formMondal";
import { formSchema, formSchemaType } from "@/schemas/formSchema";
import { currentUser } from "@clerk/nextjs";

class UserNotFoundErr extends Error {}

export async function GetFormStats() {
  const user = await currentUser();
  if (!user) {
    throw new UserNotFoundErr();
  }

  await Form.aggregate([
    {
      $match: {
        userId: user.id,
      },
    },
    {
      $group: {
        visits: { $sum: "$visits" },
        submissions: { $sum: "$submissions" },
      },
    },
  ]).then((stats) => {
    const visits = stats.length > 0 ? stats[0].visits : 0;
    const submissions = stats.length > 0 ? stats[0].submissions : 0;

    let submissionRate = 0;
    if (visits > 0) {
      submissionRate = (submissions / visits) * 100;
    }

    const bounceRate = 100 - submissionRate;

    return {
      visits,
      submissions,
      submissionRate,
      bounceRate,
    };
  });
}

export async function CreateForm(data: formSchemaType) {
  const validation = formSchema.safeParse(data);
  if (!validation.success) {
    throw new Error("Form not valid!");
  }

  const user = await currentUser();
  if (!user) {
    throw new UserNotFoundErr();
  }

  const { name, description } = data;

  const newForm = new Form({
    userId: user.id,
    name,
    description,
  });

  await newForm
    .save()
    .then((savedForm) => {
      if (!savedForm) {
        throw new Error("Someting went wrong creating the form.");
      }
      return savedForm._id;
    })
    .catch((error) => {
      console.log(error); // Handle errors appropriately
      // Consider throwing a more specific error for the client
    });
}

export async function GetForms() {
  const user = await currentUser();
  if (!user) {
    throw new UserNotFoundErr();
  }

  return await Form.find({ userId: user.id }).sort({ createdAt: -1 });
}

export async function GetFormsById(id: string) {
  const user = await currentUser();
  if (!user) {
    throw new UserNotFoundErr();
  }

  return await Form.findOne({ userId: user.id, id });
}

export async function UpdateFormContent(id: string, jsonContent: string) {
  const user = await currentUser();
  if (!user) {
    throw new UserNotFoundErr();
  }

  return await Form.findOneAndUpdate(
    {
      userId: user.id,
      id,
    },
    { content: jsonContent },
    { new: true },
  );
}

export async function PublishForm(id: string) {
  const user = await currentUser();
  if (!user) {
    throw new UserNotFoundErr();
  }

  return await Form.findOneAndUpdate(
    {
      userId: user.id,
      id,
    },
    { published: true },
    { new: true },
  );
}

export async function GetFormContentByUrl(formUrl: string) {
  return await Form.findOneAndUpdate({ shareURL: formUrl }, { $inc: { visits: 1 } }, { new: true });
}

export async function SubmitForm(formUrl: string, content: string) {
  const updatedForm = await Form.findOneAndUpdate(
    { shareURL: formUrl, published: true },
    { $inc: { submissions: 1 }, $push: { formSubmissions: { content } } },
    { new: true },
  );

  return updatedForm;
}

export async function GetFormWithSubmissions(id: string) {
  const user = await currentUser();
  if (!user) {
    throw new UserNotFoundErr();
  }

  const form = await Form.findById(id).populate("FormSubmissions").where({ userId: user.id });

  return form;
}
