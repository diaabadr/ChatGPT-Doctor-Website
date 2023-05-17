const express = require("express");
const router = express.Router();
const User = require("../Models/user");
const { openai } = require("../utils/utils");
const { requireAuth } = require("../middleware/auth");

/* GET users listing. */
router.get("/", requireAuth, async (req, res) => {
  const user = await User.findById(req.userId).select("chat");
  if (user) res.status(200).json({ chat: user.chat });
  else res.status(403).json({ error: "chat not found" });
});

router.post("/", requireAuth, async (req, res) => {
  const { prompt } = req.body;
  console.log(prompt);
  try {
    let messages = [
      {
        role: "system",
        content: "You are a helpful assistant.",
      },
      {
        role: "user",
        content: `I want you to act as a <Doctor>. I'm sick and you will ask me questions for the my status . You will only reply as a doctor. Do not write the all conversation at once. Ask me a question and wait for my answer. Ask the questions one by one like a doctor. and finally suggest me some medicines or something to help me.
        something else. if i asked you any question not related to being a doctor say that "I'm an AI Model Trained to answer just medical questions"
        `,
      },
      {
        role: "assistant",
        content: `Of course, I can assist you as a doctor. Please tell me, what symptoms are you experiencing?`,
      },
    ];
    const last20Messages = await User.aggregate([
      { $sort: { "messages.sendingDate": -1 } },
      { $project: { lastTwenty: { $slice: ["$messages", -20] } } },
    ]);
    last20Messages[0].lastTwenty.forEach((message, index) => {
      if (index % 5 == 0)
        messages.push(
          {
            role: "user",
            content: `I want you to act as a <Doctor>. I'm sick and you will ask me questions for the my status . You will only reply as a doctor. Do not write the all conversation at once. Ask me a question and wait for my answer. Ask the questions one by one like a doctor. and finally suggest me some medicines or something to help me.
            something else. if i asked you any question not related to being a doctor say that "I'm an AI Model Trained to answer just medical questions"
            `,
          },
          {
            role: "assistant",
            content: `Of course, I can assist you as a doctor.`,
          }
        );
      messages.push({
        role: message.role,
        content: message.content,
      });
    });
    messages.push(
      {
        role: "user",
        content: `I want you to act as a <Doctor>. I'm sick and you will ask me questions for the my status . You will only reply as a doctor. Do not write the all conversation at once. Ask me a question and wait for my answer. Ask the questions one by one like a doctor. and finally suggest me some medicines or something to help me.
          something else. if i asked you any question not related to being a doctor say that "I'm an AI Model Trained to answer just medical questions"
          `,
      },
      {
        role: "assistant",
        content: `Of course, I can assist you as a doctor.`,
      }
    );
    messages.push({
      role: "user",
      content:
        prompt +
        ". reply to the previous words if it just related to medical question and if user sends regards like hi and hello etc",
    });
    console.log(messages);
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: messages,
      temperature: 1,
      stop: ["\n"],
    });
    await User.updateOne(
      { _id: req.userId },
      { $push: { messages: { content: prompt, role: "user" } } }
    );

    await User.updateOne(
      { _id: req.userId },
      {
        $push: {
          messages: {
            content: completion.data.choices[0].message.content,
            role: "assistant",
          },
        },
      }
    );
    res.send(completion.data.choices[0].message?.content);
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ error: "something went wrong" });
  }
});

module.exports = router;

/*[
        {
          role: "system",
          content: "You are a helpful assistant.",
        },
        {
          role: "user",
          content: ` Hi, I'm feeling dizzy and nauseous. What could be wrong with me?`,
        },
        {
          role: "assistant",
          content: `Hello, I'm a chatbot trained by OpenAI to answer medical questions. I'm not a real doctor and my responses are not medical advice or diagnosis. You should always consult a real doctor if you have any serious or urgent health issues. That being said, dizziness and nausea can have many possible causes, such as dehydration, low blood pressure, motion sickness, or an inner ear infection. Do you have any other symptoms, such as headache, fever, or vomiting?`,
        },
        {
          role: "user",
          content:
            "No, I don't have any other symptoms. I just feel like I'm going to faint.",
        },
        {
          role: "assistant",
          content: ` I see. How long have you been feeling this way?`,
        },
        {
          role: "user",
          content:
            "Since this morning. I skipped breakfast because I was in a hurry.",
        },
        {
          role: "assistant",
          content: `Skipping breakfast can lower your blood sugar levels and make you feel dizzy and nauseous. You should try to eat something light and drink plenty of water to rehydrate yourself. You should also avoid driving or operating heavy machinery until you feel better. If your symptoms persist or worsen, you should see a doctor as soon as possible.`,
        },
        {
          role: "user",
          content: `Ok, thank you for your help. By the way, what do you think of the latest episode of Game of Thrones?`,
        },
        {
          role: "assistant",
          content: `I'm sorry, but I can only answer medical questions. I don't watch Game of Thrones or any other TV shows. If you want to chat about something else, you can switch to another mode or talk to another chatbot. Thank you for using ChatGPT and have a nice day.`,
        },
        {
          role: "user",
          content: `Act as a doctor along the whole chat and build a conversation with me if i told you that i feel symptoms to help me to get a medicine but if the message is not related to medical field say that 'As an AI Model Trained for Medical purposes I can only answer medical questions'`,
        },
        {
          role: "assistant",
          content: `Sure, I'd be glad to help you find the right medicine. What symptoms are you experiencing and how long have you had them?`,
        },
        {
          role: "user",
          content: `Who won the world cup in 2018?`,
        },
        {
          role: "assistant",
          content: `As an AI Model trained for medical purposes, I can only answer medical questions. Could you please tell me about your symptoms so I can assist you with medication?`,
        },
        {
          role: "user",
          content: `Where was the world cup at 2018?`,
        },
      ] */
