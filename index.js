const schedule = require('node-schedule');
const districtId = process.env.DISTRICT;
const date = process.env.DATE;
const eighteenPlus = process.env.EP
const puppeteer = require("puppeteer");
const apiUrl = `https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByDistrict?district_id=${districtId}&date=${date}`;

const findSlot = async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto(apiUrl);
  await page.waitForSelector("[style]");
  let element = await page.$("[style]");
  let value = JSON.parse(await page.evaluate((el) => el.textContent, element));
  await browser.close();
  value.centers.forEach((element) => {
    element.sessions.forEach((session) => {
      if (
        session.available_capacity > 0 &&
        eighteenPlus === true &&
        session.min_age_limit === 18
      ) {
        console.log(
          `Apointment available on ${session.date} for ${session.vaccine} in ${element.name} for 18+`
        );
      } else if (session.available_capacity > 0 && session.min_age_limit !== 18 && eighteenPlus === false) {
        console.log(
          `Apointment available on ${session.date} for ${session.vaccine} in ${element.name} for 45+`
        );
      }
    });
  });
};

schedule.scheduleJob('* * * * *', async () => {
    await findSlot()
})

// schedule.scheduleJob('* * * * *', () => {
//     console.log("started")
// });


  

;
// let test = () => (async () => {
//     const browser = await puppeteer.launch();
//     const page = await browser.newPage();
//     await page.goto(apiUrl);
//     await page.waitForTimeout(30000)
//     await browser.close();
//   })

// test()
// const districtId = process.env.DISTRICT;
// const date = process.env.DATE;
// const eighteenPlus = process.env.EP;



// console.log(apiUrl);

// const isAppointmentAvailable = () => {
//   axios
//     .get(apiUrl, {header: {
//         'accept': "application/json",
//         'Accept-Language': 'en_US'
//     }})
//     .then((res) => {
//       res.body.centers.forEach((element) => {
//         element.sessions.forEach((session) => {
//           if (
//             session.available_capacity > 0 &&
//             eighteenPlus === true &&
//             session.min_age_limit === 18
//           ) {
//             console.log(
//               `Apointment available on ${session.date} for ${session.vaccine}`
//             );
//           } else if (session.available_capacity > 0) {
//             console.log(
//               `Apointment available on ${session.date} for ${session.vaccine}`
//             );
//           }
//         });
//       });
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// };

// isAppointmentAvailable();
