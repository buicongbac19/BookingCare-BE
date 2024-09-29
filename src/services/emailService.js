require("dotenv").config();
import nodemailer from "nodemailer";
import moment from "moment";

let sendSimpleEmail = async (dataSend) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // Use `true` for port 465, `false` for all other ports
    auth: {
      user: process.env.GMAIL_APP,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });

  const info = await transporter.sendMail({
    from: '"Tiểu Mao Mi 👻" <taodeobietmayngua@gmail.com>', // sender address
    to: dataSend.receiverEmail, // list of receivers
    subject: "Thông tin đặt lịch khám bệnh", // Subject line
    html: `
    <!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap"
      rel="stylesheet"
    />
    <style>
      * {
        font-family: "Montserrat", sans-serif;
        margin: 0;
        padding: 0;
      }

      .appointment-container {
        max-width: 1140px;
        margin: auto;
        padding: 0 10px;
      }
      .welcome {
        padding-top: 60px;
        font-size: 38px;
        color: #49bce2;
        font-weight: bold;
        text-align: center;
      }
      .desc {
        margin-top: 30px;
        font-size: 20px;
        text-align: center;
        font-weight: 600;
      }

      .desc div {
        margin-top: 30px;
        color: #49bce2;
      }

      .desc a {
        color: #49bce2;
        text-decoration: none;
      }


      .appointment {
        margin-top: 30px;
        font-family: Arial, Helvetica, sans-serif;
        border-collapse: collapse;
        width: 80%;
        margin-left: auto;
        margin-right: auto;
      }

      .appointment td,
      .appointment th {
        border: 1px solid #49bce2;
        padding: 8px;
        font-size: 20px;
      }

      .appointment td.primary {
        font-weight: 600;
      }

      .appointment tr:hover {
        background-color: #ddd;
      }

      .appointment th {
        padding-top: 12px;
        padding-bottom: 12px;
        text-align: left;
        background-color: #49bce2;
        color: white;
      }

      .confirm-text {
        /* color: #49bce2; */
        text-align: center;
        margin-top: 30px;
        font-weight: 600;
        font-size: 20px;
      }

      .confirm-btn:hover {
        opacity: 0.8;
      }
    </style>
  </head>
  <body
    style="
      background-image: url(https://cdn.bookingcare.vn/fo/w1920/2023/11/01/140311-background5.png);
    "
  >
    <div class="appointment-container">
      <div class="welcome">Xin chào, ${dataSend.patientName}!</div>
      <div class="desc">
        Bạn nhận được email này vi bạn đã đặt lịch khám bệnh online trên
        <a href="https://bookingcare.vn">BookingCare.vn</a>
        <div>Dưới đây là thông tin chi tiết về lịch khám bệnh của bạn:</div>
      </div>
      <table class="appointment">
        <tr>
          <th></th>
          <th></th>
        </tr>
        <tr>
          <td class="primary">Thời gian</td>
          <td>${dataSend.time}</td>
        </tr>
        <tr>
          <td class="primary">Bác sĩ</td>
          <td>${dataSend.doctorName}</td>
        </tr>
        <tr>
          <td class="primary">Địa chỉ phòng khám</td>
          <td>${dataSend.clinicAddress}</td>
        </tr>
        <tr>
          <td class="primary">Giá khám</td>
          <td>${dataSend.price}</td>
        </tr>
        <tr>
          <td class="primary">Phí đặt lịch</td>
          <td>Miễn phí</td>
        </tr>
        <tr>
          <td class="primary">Tổng cộng</td>
          <td>${dataSend.price}</td>
        </tr>
      </table>
      <div class="confirm-text">
        Nếu những thông tin trên là đúng, vui lòng click vào nút dưới đây để xác
        nhận lịch khám!
      </div>
      <div
        style="margin-bottom: 60px; display: flex; justify-content: center; padding-bottom: 60px"
        class="confirm-btn-container"
      >
         <a
          style="
            text-decoration: none;
            margin-top: 30px;
            padding: 0 10px;
            text-align: center;
            height: 40px;
            font-size: 20px;
            font-weight: 600;
            width: fit-content;
            border-radius: 9999px;
            display: flex;
            justify-content: center;
            /* align-items: center; */
            margin-left: auto;
            margin-right: auto;
            background-color: #49bce2;
            color: #fff;
            cursor: pointer;
            margin-bottom: 30px;
          "
          class="confirm-btn"
          href=${dataSend.redirectLink}
          target="_blank"
        >
          <div style="margin-top: 5px">Click me</div>
        </a>
      </div>
    </div>
  </body>
</html>
    `,
  });
};

let sendPrescription = async (dataSend) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // Use `true` for port 465, `false` for all other ports
    auth: {
      user: process.env.GMAIL_APP,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });

  const info = await transporter.sendMail({
    from: '"Tiểu Mao Mi 👻" <taodeobietmayngua@gmail.com>', // sender address
    to: dataSend.email, // list of receivers
    subject: "Thông tin hoá đơn khám bệnh", // Subject line
    html: `
    <h3>Xin chào ${dataSend.patientName}!</h3>
    <p>Bạn nhận được email này vì đã hoàn tất đặt lịch khám bệnh online trên BookingCare.vn</p>
    <p>Thông tin đơn thuốc được gửi trong file đính kèm.</p>
    <p>Xin chân thành cảm ơn</p>
    `, // html body
    attachments: [
      {
        filename: `Prescription - ${dataSend.patientId} - ${moment(
          new Date()
        ).format("DD/MM/YYYY")}.png`,
        content: dataSend.image.split("base64,")[1],
        encoding: "base64",
      },
    ],
  });
};

module.exports = {
  sendSimpleEmail,
  sendPrescription,
};
