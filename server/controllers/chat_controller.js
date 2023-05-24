const User = require("../Models/user");
const { openai } = require("../utils/utils");

const chatGetController = async (req, res) => {
  const userChat = await User.findById(req.userId).select("messages");
  if (userChat) {
    const lastMessage = await User.aggregate([
      { $sort: { "messages.sendingDate": -1 } },
      { $project: { lastOne: { $slice: ["$messages", -1] } } },
    ]);

    if (lastMessage[0].lastOne.role === "user") {
      await storeMessageInDB(
        req.userId,
        `I can assist you as a doctor. Please tell me, what symptoms are you experiencing?`,
        "assistant"
      );
      userChat.messages.push({
        role: "assistant",
        content:
          "I can assist you as a doctor. Please tell me, what symptoms are you experiencing?",
      });
    }
    res.status(200).json({ chat: userChat.messages });
  } else {
    res.status(403).json({ error: "chat not found" });
  }
};

const chatPostController = async (req, res) => {
  const { prompt, model = "gpt" } = req.body;
  if (!prompt)
    return res.status(400).send({ error: "Prompt is missing in the request" });

  try {
    if (model === "image") {
      const result = await openai.createImage({
        prompt: prompt,
        response_format: "url",
        size: "512x512",
      });
      await storeMessageInDB(req.userId, prompt, "user");
      await storeMessageInDB(req.userId, result.data.data[0].url, "assistant");
      return res.status(200).send(result.data.data[0].url);
    }
    let messages = [
      {
        role: "system",
        content: "You are a helpful assistant.",
      },
    ];
    messages.push({
      content: `I want you to act as a <Doctor>. I'm sick and you will ask me questions for the my status . You will only reply as a doctor. Do not write the all conversation at once. Ask me a question and wait for my answer. Ask the questions one by one like a doctor. and finally suggest me some medicines or something to help me.
      something else. if i asked you any question not related to being a doctor say that "I'm an AI Model Trained to answer just medical questions"
      `,
      role: "user",
    });
    messages.push({
      role: "assistant",
      content:
        "of course, I can assist you as a doctor. Please tell me, what symptoms are you experiencing?",
    });
    const last10Messages = await User.aggregate([
      { $sort: { "messages.sendingDate": -1 } },
      { $project: { lastTen: { $slice: ["$messages", -10] } } },
    ]);
    last10Messages[0].lastTen.forEach((message, index) => {
      messages.push({
        role: message.role,
        content: message.content,
      });
    });

    messages.push({
      role: "user",
      content:
        prompt +
        ". reply to the previous words if it's related to medical question, you can reply also to the greetings",
    });

    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: messages,
      temperature: 0.8,
      stop: ["\n"],
    });
    await storeMessageInDB(req.userId, prompt, "user");
    await storeMessageInDB(
      req.userId,
      completion.data.choices[0].message?.content,
      "assistant"
    );

    res.send(completion.data.choices[0].message?.content);
  } catch (err) {
    res.status(500).json({ error: "Not Allowed" });
  }
};

const storeMessageInDB = async function (userId, message, role) {
  await User.updateOne(
    { _id: userId },
    { $push: { messages: { content: message, role: role } } }
  );
};

module.exports = { chatGetController, chatPostController };
