import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import Company from './models/Company.js';
import ApprovalFlow from './models/ApprovalFlow.js';

dotenv.config();

const seed = async () => {
  await connectDB();

  const companies = await Company.find({});
  if (companies.length === 0) {
    console.log('❌ No companies found. Sign up first to create a company, then re-run this script.');
    process.exit(1);
  }

  let seeded = 0;
  for (const company of companies) {
    const existing = await ApprovalFlow.findOne({ companyId: company._id, isDefault: true });
    if (existing) {
      console.log(`⚠️  [${company.name}] Already has a default approval flow ("${existing.name}"). Skipping.`);
      continue;
    }

    await ApprovalFlow.create({
      companyId: company._id,
      name: 'Default Sequential Flow',
      isDefault: true,
      steps: [
        {
          stepName: 'Manager Approval',
          ruleType: 'Sequential',
          requiredRole: 'Manager',
        },
        {
          stepName: 'Admin Final Approval',
          ruleType: 'Sequential',
          requiredRole: 'Admin',
        },
      ],
    });

    console.log(`✅ [${company.name}] Created default 2-step approval flow: Manager → Admin`);
    seeded++;
  }

  if (seeded > 0) {
    console.log(`\n🎉 Done! Seeded ${seeded} approval flow(s).`);
  } else {
    console.log('\nℹ️  Nothing to seed.');
  }

  process.exit(0);
};

seed().catch((err) => {
  console.error('Seeder error:', err.message);
  process.exit(1);
});
