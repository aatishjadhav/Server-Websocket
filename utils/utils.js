`use strict`;

const { MaxTargetValue, InitialValues } = require("./constants");
const fs = require("fs");
const numberFormatter = new Intl.NumberFormat("en-US");

const totalDurationHours = 96;
const randomVariation = Math.floor(Math.random() * (10 - -10 + 1)) + -10;
const totalIntervalsIn96Hours = totalDurationHours * 60 + randomVariation;

const getFilename = () => {
  const filename =
    process.env.NODE_ENV == "dev" ? "/statistic.json" : "/prod.statistic.json";

  if (!fs.existsSync(__dirname + filename)) {
    fs.writeFileSync(
      __dirname + filename,
      JSON.stringify(InitialValues),
      "utf8"
    );
  } 
};

const getFormattedData = (data) => {
  return {
    totalSales: numberFormatter.format(data.totalSales.toFixed(2)),
    totalNoOfGiftCardsSold: numberFormatter.format(
      data.totalNoOfGiftCardsSold.toFixed(0)
    ),
    giftCardsSold: numberFormatter.format(data.giftCardsSold.toFixed(2)),
    giftCardsRedeem: numberFormatter.format(data.giftCardsRedeem.toFixed(2)),
    totalOrderValueLift: numberFormatter.format(
      data.totalOrderValueLift.toFixed(2)
    ),
    loyaltyPointsEarn: numberFormatter.format(
      data.loyaltyPointsEarn.toFixed(0)
    ),
    loyaltyPointsRedeem: numberFormatter.format(
      data.loyaltyPointsRedeem.toFixed(0)
    ),
    orderPlacedUsingLoyaltyPoints: numberFormatter.format(
      Math.round(data.orderPlacedUsingLoyaltyPoints)
    ),
    totalOrders: numberFormatter.format(Math.round(data.totalOrders)),
  };
};

const getRandomValue = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const getIncValue = (maxValue, interval, percentage) => {
  const maxInc = maxValue / interval;
  const incValue = Math.round((maxInc * percentage) / 100);
  return incValue || 0;
};

const getUpdateValues = () => {
  const filename = getFilename();
  const data = JSON.parse(
    fs.readFileSync(__dirname + filename, {
      encoding: "utf8",
    })
  );

  const randomPercentage = getRandomValue(1, 10);
  const maxIncrement = MaxTargetValue.totalSales / totalIntervalsIn96Hours;
  const rangeFrom = maxIncrement - (maxIncrement * randomPercentage) / 100;
  const incValue = getRandomValue(rangeFrom, maxIncrement);
  const totalSales = data.totalSales + incValue;
  const percentage = Math.round((incValue / maxIncrement) * 100);

  const totalNoOfGiftCardsSold =
    data.totalNoOfGiftCardsSold +
    getIncValue(
      MaxTargetValue.totalNoOfGiftCardsSold,
      totalIntervalsIn96Hours,
      percentage
    );

  const giftCardsSold =
    data.giftCardsSold +
    getIncValue(
      MaxTargetValue.giftCardsSold,
      totalIntervalsIn96Hours,
      percentage
    );
  const giftCardsRedeem =
    data.giftCardsRedeem +
    getIncValue(
      MaxTargetValue.giftCardsRedeem,
      totalIntervalsIn96Hours,
      percentage
    );

  const totalOrderValueLift =
    data.totalOrderValueLift +
    getIncValue(
      MaxTargetValue.totalOrderValueLift,
      totalIntervalsIn96Hours,
      percentage
    );

  const loyaltyPointsEarn =
    data.loyaltyPointsEarn +
    getIncValue(
      MaxTargetValue.loyaltyPointsEarn,
      totalIntervalsIn96Hours,
      percentage
    );

  const loyaltyPointsRedeem =
    data.loyaltyPointsRedeem +
    getIncValue(
      MaxTargetValue.loyaltyPointsRedeem,
      totalIntervalsIn96Hours,
      percentage
    );

  const orderPlacedUsingLoyaltyPoints =
    data.orderPlacedUsingLoyaltyPoints +
    getIncValue(
      MaxTargetValue.orderPlacedUsingLoyaltyPoints,
      totalIntervalsIn96Hours,
      percentage
    );

  const totalOrders =
    data.totalOrders +
    getIncValue(
      MaxTargetValue.totalOrders,
      totalIntervalsIn96Hours,
      percentage
    );

  const objToSave = {
    totalSales,
    totalNoOfGiftCardsSold,
    giftCardsSold,
    giftCardsRedeem,
    totalOrderValueLift,
    loyaltyPointsEarn,
    loyaltyPointsRedeem,
    orderPlacedUsingLoyaltyPoints,
    totalOrders,
  };

  fs.writeFileSync(__dirname + filename, JSON.stringify(objToSave));
  return getFormattedData(objToSave);
};

const getInitialData = () => {
  const data = JSON.parse(
    fs.readFileSync(__dirname + getFilename(), {
      encoding: "utf8",
    })
  );
  return getFormattedData(data);
};

module.exports = {
  getFilename,
  getInitialData,
  getUpdateValues,
  totalIntervalsIn96Hours,
};