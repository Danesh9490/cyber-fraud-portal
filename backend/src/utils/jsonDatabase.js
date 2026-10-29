const express = require("express");
const crypto = require("crypto");

const {
  addToCollection,
  readCollection,
} = require("../utils/jsonDatabase");

const router = express.Router();

function createCaseNumber() {
  const year = new Date().getFullYear();

  const random = crypto
    .randomBytes(4)
    .toString("hex")
    .toUpperCase();

  return `CF-${year}-${random}`;
}

router.post("/", async (req, res) => {
  try {
    const {
      fraudType,
      incidentDate,
      amount,
      phoneNumber,
      transactionReference,
      description,
    } = req.body;

    if (!fraudType || !description) {
      return res.status(400).json({
        success: false,
        message: "Fraud type and description are required.",
      });
    }

    const report = {
      id: crypto.randomUUID(),

      caseNumber: createCaseNumber(),

      fraudType,
      incidentDate: incidentDate || null,

      amount:
        amount !== undefined && amount !== ""
          ? Number(amount)
          : null,

      phoneNumber: phoneNumber || null,

      transactionReference:
        transactionReference || null,

      description,

      status: "SUBMITTED",

      createdAt: new Date().toISOString(),

      updatedAt: new Date().toISOString(),
    };

    await addToCollection(
      "fraud-reports",
      report
    );

    await addToCollection(
      "audit-logs",
      {
        id: crypto.randomUUID(),
        action: "FRAUD_REPORT_CREATED",
        caseNumber: report.caseNumber,
        createdAt: new Date().toISOString(),
      }
    );

    res.status(201).json({
      success: true,
      message: "Fraud report submitted successfully.",
      report: {
        caseNumber: report.caseNumber,
        status: report.status,
        createdAt: report.createdAt,
      },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Unable to submit fraud report.",
    });
  }
});

router.get("/:caseNumber", async (req, res) => {
  try {
    const reports = await readCollection(
      "fraud-reports"
    );

    const report = reports.find(
      (item) =>
        item.caseNumber === req.params.caseNumber
    );

    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Case not found.",
      });
    }

    res.json({
      success: true,
      report,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Unable to retrieve case.",
    });
  }
});

module.exports = router;