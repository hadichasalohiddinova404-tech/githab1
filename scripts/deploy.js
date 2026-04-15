// scripts/deploy.js
// SimpleStorage kontraktini deploy qilish va ABI ni yangilash

const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("🚀 SimpleStorage deploy qilinmoqda...\n");

  // Deploy qilish
  const SimpleStorage = await ethers.getContractFactory("SimpleStorage");
  const contract = await SimpleStorage.deploy();
  await contract.waitForDeployment();

  const address = await contract.getAddress();
  console.log(`✅ SimpleStorage deploy qilindi!`);
  console.log(`📌 Kontrakt adresi: ${address}`);

  // ABI va adresni contract/SimpleStorage.json ga yozish
  const artifact = await ethers.getContractFactory("SimpleStorage");
  const abiPath = path.join(__dirname, "..", "contract", "SimpleStorage.json");

  const existing = JSON.parse(fs.readFileSync(abiPath, "utf8"));
  existing.networks = existing.networks || {};
  existing.networks["31337"] = { address };

  fs.writeFileSync(abiPath, JSON.stringify(existing, null, 2));
  console.log(`📄 Kontrakt adresi ABI fayliga saqlandi: contract/SimpleStorage.json`);

  // Barcha JS fayllaridagi CONTRACT_ADDRESS ni yangilash
  const jsFiles = [
    "web3-setup.js",
    "contract-instance.js",
    "view-function.js",
    "send-transaction.js",
    "error-handling.js",
    "gas-settings.js",
    "index.js",
  ];

  const rootDir = path.join(__dirname, "..");
  const OLD_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

  let updated = 0;
  for (const file of jsFiles) {
    const filePath = path.join(rootDir, file);
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, "utf8");
      if (content.includes(OLD_ADDRESS)) {
        const newContent = content.replaceAll(OLD_ADDRESS, address);
        fs.writeFileSync(filePath, newContent, "utf8");
        console.log(`   📝 Yangilandi: ${file}`);
        updated++;
      }
    }
  }

  // Agar yangi adres boshqacha bo'lsa
  if (address !== OLD_ADDRESS && updated === 0) {
    console.log(`\n⚠️  Barcha fayllarda CONTRACT_ADDRESS ni qo'lda yangilang:`);
    console.log(`   "${address}"`);
  }

  console.log(`\n✅ Deploy muvaffaqiyatli! ${updated} ta fayl yangilandi.`);
  console.log(`\n▶️  Endi ishga tushiring: node index.js`);
}

main().catch((err) => {
  console.error("❌ Deploy xatosi:", err);
  process.exit(1);
});
