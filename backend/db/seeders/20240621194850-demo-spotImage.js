"use strict";

const { SpotImage } = require("../models");
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

const spotImageData = [
  {
    spotId: 1,
    url: "https://a0.muscache.com/im/pictures/hosting/Hosting-1052202926834866362/original/47027384-f263-426e-a18f-3aa9a34e6811.jpeg?im_w=960",
    preview: true,
  },
  {
    spotId: 1,
    url: "https://a0.muscache.com/im/pictures/hosting/Hosting-1052202926834866362/original/47027384-f263-426e-a18f-3aa9a34e6811.jpeg?im_w=96https://a0.muscache.com/im/pictures/hosting/Hosting-1052202926834866362/original/ba9e57b6-d172-4ed6-9b18-4962df854894.jpeg?im_w=720",
    preview: false,
  },
  {
    spotId: 1,
    url: "https://a0.muscache.com/im/pictures/hosting/Hosting-1052202926834866362/original/e1749a6c-42bd-49fc-8793-1565c35effa9.jpeg?im_w=720",
    preview: false,
  },
  {
    spotId: 1,
    url: "https://a0.muscache.com/im/pictures/hosting/Hosting-1052202926834866362/original/4748bc94-ee75-45bb-a04d-91717e71b0df.jpeg?im_w=720",
    preview: false,
  },
  {
    spotId: 1,
    url: "https://a0.muscache.com/im/pictures/hosting/Hosting-1052202926834866362/original/3f7daa0f-e0e2-4c78-92f9-80410b735155.jpeg?im_w=720",
    preview: false,
  },
  {
    spotId: 2,
    url: "https://a0.muscache.com/im/pictures/c88d4356-9e33-4277-83fd-3053e5695333.jpg?im_w=960",
    preview: true,
  },
  {
    spotId: 2,
    url: "https://a0.muscache.com/im/pictures/276f8063-6c12-44a8-8885-8e98772b792f.jpg?im_w=1200",
    preview: false,
  },
  {
    spotId: 2,
    url: "https://a0.muscache.com/im/pictures/ae57a6df-67a2-4175-80d6-aacd587a4d60.jpg?im_w=1200",
    preview: false,
  },
  {
    spotId: 2,
    url: "https://a0.muscache.com/im/pictures/68582ab1-66e6-4bf7-a2e4-901f4af480ef.jpg?im_w=720",
    preview: false,
  },
  {
    spotId: 2,
    url: "https://a0.muscache.com/im/pictures/f6bf4782-d917-4f73-ab02-d44aa30869c7.jpg?im_w=720",
    preview: false,
  },
  {
    spotId: 3,
    url: "https://a0.muscache.com/im/pictures/2171a374-aa34-45f6-a43b-2cbedd8e0791.jpg?im_w=960",
    preview: true,
  },
  {
    spotId: 3,
    url: "https://a0.muscache.com/im/pictures/3c61da2c-790d-4a24-b31d-c4ce27cf1f48.jpg?im_w=720",
    preview: false,
  },
  {
    spotId: 3,
    url: "https://a0.muscache.com/im/pictures/f7d1ee1e-ba06-4a02-9c17-5a5b5e9395e6.jpg?im_w=720",
    preview: false,
  },
  {
    spotId: 3,
    url: "https://a0.muscache.com/im/pictures/518b0167-b46d-401c-ac83-5ab530ea5014.jpg?im_w=720",
    preview: false,
  },
  {
    spotId: 3,
    url: "https://a0.muscache.com/im/pictures/miso/Hosting-931540283290280614/original/9cbabddb-e191-417c-87e1-5262ec9da3c7.jpeg?im_w=1200",
    preview: false,
  },
  {
    spotId: 4,
    url: "https://a0.muscache.com/im/pictures/miso/Hosting-53955911/original/4b3a35b1-11f2-44e5-9b90-90aef6e4f2bc.jpeg?im_w=720",
    preview: true,
  },
  {
    spotId: 4,
    url: "https://a0.muscache.com/im/pictures/miso/Hosting-53955911/original/66e57c0c-54ed-40c2-83f4-b50789060ae8.jpeg?im_w=720",
    preview: false,
  },
  {
    spotId: 4,
    url: "https://a0.muscache.com/im/pictures/miso/Hosting-53955911/original/25525d15-0164-45b3-8622-c2f5ddddd580.jpeg?im_w=720",
    preview: false,
  },
  {
    spotId: 4,
    url: "https://a0.muscache.com/im/pictures/miso/Hosting-53955911/original/16a563d4-268e-46cd-92d9-5377c986a6a0.jpeg?im_w=1200",
    preview: false,
  },
  {
    spotId: 4,
    url: "https://a0.muscache.com/im/pictures/miso/Hosting-53955911/original/87169d41-e70c-471b-bfa9-80641b8e92e2.jpeg?im_w=720",
    preview: false,
  },
  {
    spotId: 5,
    url: "https://a0.muscache.com/im/pictures/airflow/Hosting-4950937/original/cee9ca76-04b3-4a09-ad54-246154f1458a.jpg?im_w=960",
    preview: true,
  },
  {
    spotId: 5,
    url: "https://a0.muscache.com/im/pictures/580264bb-1dd6-403d-a8ce-f87ed6e80702.jpg?im_w=1200",
    preview: false,
  },
  {
    spotId: 5,
    url: "https://a0.muscache.com/im/pictures/44f05856-348d-47df-b88f-a8df6ad0eb76.jpg?im_w=720",
    preview: false,
  },
  {
    spotId: 5,
    url: "https://a0.muscache.com/im/pictures/airflow/Hosting-4950937/original/75d55a2c-38ea-45ed-b09a-d305ba623278.jpg?im_w=1200",
    preview: false,
  },
  {
    spotId: 5,
    url: "https://a0.muscache.com/im/pictures/20015a62-7fb9-40e8-b502-6233adad7147.jpg?im_w=1200",
    preview: false,
  },
  {
    spotId: 6,
    url: "https://a0.muscache.com/im/pictures/miso/Hosting-725341367693454220/original/93cc90e1-c491-46e9-b0b4-f33a1444930f.jpeg?im_w=720",
    preview: true,
  },
  {
    spotId: 6,
    url: "https://a0.muscache.com/im/pictures/miso/Hosting-725341367693454220/original/3858d5c1-de5f-4dba-96b4-1e3914beacb8.jpeg?im_w=720",
    preview: false,
  },
  {
    spotId: 6,
    url: "https://a0.muscache.com/im/pictures/miso/Hosting-725341367693454220/original/40b536c1-c76c-4c17-b8b3-03324a1fd3ad.jpeg?im_w=720",
    preview: false,
  },
  {
    spotId: 6,
    url: "https://a0.muscache.com/im/pictures/miso/Hosting-725341367693454220/original/6db1b2dc-d621-4bcd-b055-a3cfdabc7ca2.jpeg?im_w=720",
    preview: false,
  },
  {
    spotId: 6,
    url: "https://a0.muscache.com/im/pictures/miso/Hosting-725341367693454220/original/ff637fd7-62db-4b11-b362-57432fe8155b.jpeg?im_w=720",
    preview: false,
  },
  {
    spotId: 7,
    url: "https://a0.muscache.com/im/pictures/miso/Hosting-6378814/original/3d8150c0-b5ab-4996-924e-de66c9039a11.jpeg?im_w=960",
    preview: true,
  },
  {
    spotId: 7,
    url: "https://a0.muscache.com/im/pictures/miso/Hosting-6378814/original/b2222a31-d6e1-415c-90e4-ae7035e77a26.jpeg?im_w=720",
    preview: false,
  },
  {
    spotId: 7,
    url: "https://a0.muscache.com/im/pictures/30a2a018-4c73-4fe0-86d5-42dc6fe1fe91.jpg?im_w=720",
    preview: false,
  },
  {
    spotId: 7,
    url: "https://a0.muscache.com/im/pictures/miso/Hosting-6378814/original/7e0fc84a-4e63-43d8-9ecd-1785a21a7f4c.jpeg?im_w=1200",
    preview: false,
  },
  {
    spotId: 7,
    url: "https://a0.muscache.com/im/pictures/ec8cc256-2930-44c8-8e06-a01059ced30d.jpg?im_w=1200",
    preview: false,
  },
  {
    spotId: 8,
    url: "https://a0.muscache.com/im/pictures/361057af-4202-42c8-b02d-6422705edc03.jpg?im_w=960",
    preview: true,
  },
  {
    spotId: 9,
    url: "https://a0.muscache.com/im/pictures/3e078b53-e442-4605-8023-648bd9b3c730.jpg?im_w=720",
    preview: true,
  },
  {
    spotId: 10,
    url: "https://a0.muscache.com/im/pictures/e99f4706-2c4e-4690-a7da-d6ad5184c50f.jpg?im_w=720",
    preview: true,
  },
  {
    spotId: 11,
    url: "https://a0.muscache.com/im/pictures/miso/Hosting-908676155218671796/original/b6ee0476-0027-4fc1-9dce-89a2ccc54361.jpeg?im_w=720",
    preview: true,
  },
  {
    spotId: 12,
    url: "https://a0.muscache.com/im/pictures/4f8d1797-818a-426b-b0f0-2c7e6ab91a4d.jpg?im_w=720",
    preview: true,
  },
  {
    spotId: 13,
    url: "https://a0.muscache.com/im/pictures/miso/Hosting-44106940/original/66a4178c-8c97-4a18-80fb-1da7842a2f9a.jpeg?im_w=720",
    preview: true,
  },
  {
    spotId: 14,
    url: "https://a0.muscache.com/im/pictures/miso/Hosting-53219659/original/5994c0c6-58e1-4745-bdb9-10dabb911c41.jpeg?im_w=720",
    preview: true,
  },
  {
    spotId: 15,
    url: "https://a0.muscache.com/im/pictures/prohost-api/Hosting-49618152/original/f3b76d93-67ee-4ab0-88cd-1c01b59a7d76.jpeg?im_w=720",
    preview: true,
  },
  {
    spotId: 16,
    url: "https://a0.muscache.com/im/pictures/hosting/Hosting-U3RheVN1cHBseUxpc3Rpbmc6NTQ4ODUwOQ%3D%3D/original/1abf9fd3-4e9c-4166-ac54-d52ec164eda6.jpeg?im_w=720",
    preview: true,
  },
  {
    spotId: 17,
    url: "https://a0.muscache.com/im/pictures/miso/Hosting-43946664/original/1c6cc1ea-4622-4024-90be-17abe4ed028d.jpeg?im_w=720",
    preview: true,
  },
  {
    spotId: 18,
    url: "https://a0.muscache.com/im/pictures/miso/Hosting-731059780954437660/original/3ce55557-09f2-45e5-bcfb-eccc1b504c83.jpeg?im_w=720",
    preview: true,
  },
  {
    spotId: 19,
    url: "https://a0.muscache.com/im/pictures/miso/Hosting-715990626223541790/original/694ee517-4dd7-4ace-92d6-c96ec635bdf0.jpeg?im_w=720",
    preview: true,
  },
  {
    spotId: 20,
    url: "https://a0.muscache.com/im/pictures/hosting/Hosting-U3RheVN1cHBseUxpc3Rpbmc6OTQwNzg1MTU3NjI4MTk2MDc2/original/9b8482f6-3ff3-4d54-b19e-8bba5aae933e.png?im_w=720",
    preview: true,
  },
  {
    spotId: 21,
    url: "https://a0.muscache.com/im/pictures/miso/Hosting-44403770/original/3c267e60-7c19-40f0-92c6-960144107e6c.png?im_w=720",
    preview: true,
  },
  {
    spotId: 22,
    url: "https://a0.muscache.com/im/pictures/e443e4cd-f000-43e2-b6b8-ef928a407ee2.jpg?im_w=720",
    preview: true,
  },
  {
    spotId: 23,
    url: "https://a0.muscache.com/im/pictures/miso/Hosting-29389628/original/db459df4-439c-485c-891a-e370cac880b5.jpeg?im_w=720",
    preview: true,
  },
  {
    spotId: 24,
    url: "https://a0.muscache.com/im/pictures/miso/Hosting-25267358/original/a37591d4-6d01-45eb-95e3-d477853801a5.jpeg?im_w=720",
    preview: true,
  },
];

module.exports = {
  async up(queryInterface, Sequelize) {
    await SpotImage.bulkCreate(spotImageData, { validate: true });
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "SpotImages";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, spotImageData, {});
  },
};
