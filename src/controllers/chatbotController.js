import chatbotService from "../services/chatbotService";

let sendMessage = async (req, res) => {
  try {
    let response = await chatbotService.sendMessage(req.body.question);
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from server...",
    });
  }
};

module.exports = {
  sendMessage,
};
