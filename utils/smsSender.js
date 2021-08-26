const axios = require("axios");
const soap = require("soap");

async function smsSender(phone, msg) {
  var url = "https://www.payam-resan.com/ws/v2/ws.asmx?WSDL";
  var args = {
    Username: "09141472686",
    PassWord: "a.9141472686",
    SenderNumber: "30002190000699",
    RecipientNumbers: [{ string: phone }],
    MessageBodie: `VetNow\nCode: ${msg}`,
    Type: 1,
    AllowedDelay: 0,
  };

  soap.createClient(url, function (err, client) {
    client.SendMessage(args, function (err, result) {
      if (err) {
        smsSender();
      }
    });
  });

  // msg = `Code\: ${msg}`;
  // try {
  //   const res = await axios.post("http://ippanel.com/api/select", {
  //     op: "send",
  //     uname: "09141472686",
  //     pass: "faraz2740321031",
  //     message: `${msg}`,
  //     from: "5000125475",
  //     to: new Array(phone),
  //   });
  //   console.log(res);
  //   return res;
  // } catch (e) {
  //   console.log(e);
}

module.exports = smsSender;

// var url = "https://www.payam-resan.com/ws/v2/ws.asmx?WSDL";
// var args = {
//   Username: "09141472686",
//   PassWord: "a.9141472686",
//   SenderNumber: "30002190000699",
//   RecipientNumbers: ["09362712519"],
//   MessageBodie: `hello`,
//   Type: 1,
//   AllowedDelay: 0,
// };
// soap
//   .createClientAsync(url)
//   .then((client) => {
//     return client.SendMessageAsync(args);
//   })
//   .then((result) => {
//     console.log(result);
//   });

// soap
// .createClientAsync(url)
// .then((client) => {
//   console.log(client);
//   return client.GetMessagesStatusAsync({messageId:"351961000"});
// })
// .then((result) => {
//   console.log(result[0].GetMessagesStatusResult.long);
// });

// toString(msg);
// msg = `Code\: ${msg}`;
// const res = await axios.post(
//   `https://www.payam-resan.com/APISend.aspx?Username=09141472686&Password=a.9141472686&From=2000079&To=${phone}&Text=${msg}`
// );
// return res;

// {Username: "09141472686",PassWord: "a.9141472686",messageID:[351961000]}
