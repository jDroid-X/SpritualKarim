const fs = require('fs');
const path = require('path');

const webRoot = path.resolve('c:/Users/jiten/jAnitGravity/SpritualKarim/SpritualKarimWeb');
const timestamp = Date.now();

// Read root index.html
let indexHtml = fs.readFileSync(path.join(webRoot, 'index.html'), 'utf8');

// Ensure updated cache-busting version parameter
indexHtml = indexHtml.replace(/href="css\/profile-admin\.css(\?v=[^"]*)?"/g, `href="css/profile-admin.css?v=sk_v5_${timestamp}"`);
indexHtml = indexHtml.replace(/src="js\/profile-admin\.js(\?v=[^"]*)?"/g, `src="js/profile-admin.js?v=sk_v5_${timestamp}"`);
fs.writeFileSync(path.join(webRoot, 'index.html'), indexHtml, 'utf8');
console.log('✅ Updated root index.html with fresh cache query');

// Portals configuration
const portals = [
  { dir: 'Masters', role: 'ADMIN', title: 'Master Admin Portal', badgeClass: 'badge-admin', badgeText: '👑 MASTER FOUNDER' },
  { dir: 'Healers', role: 'HEALER', title: 'Healers Portal', badgeClass: 'badge-healer', badgeText: '🛡️ CERTIFIED HEALER' },
  { dir: 'Trainee', role: 'TRAINEE', title: 'Trainee Sadhak Portal', badgeClass: 'badge-trainee', badgeText: '🌿 TRAINEE SADHAK' },
  { dir: 'Devotee', role: 'DEVOTEE', title: 'Devotee Portal', badgeClass: 'badge-devotee', badgeText: '👤 DEVOTEE / SEEKER' }
];

portals.forEach(p => {
  const dirPath = path.join(webRoot, p.dir);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }

  // Adjust relative paths for subdirectories (../css, ../js, ../Logo.png, etc.)
  let subHtml = indexHtml;

  // Replace links and sources to point to parent directory
  subHtml = subHtml.replace(/href="css\/profile-admin\.css\?v=[^"]*"/g, `href="../css/profile-admin.css?v=sk_v5_${timestamp}"`);
  subHtml = subHtml.replace(/src="js\/profile-admin\.js\?v=[^"]*"/g, `src="../js/profile-admin.js?v=sk_v5_${timestamp}"`);
  subHtml = subHtml.replace(/src="Logo\.png"/g, 'src="../Logo.png"');
  subHtml = subHtml.replace(/href="index\.html"/g, 'href="../index.html"');
  subHtml = subHtml.replace(/href="Masters\/index\.html"/g, 'href="../Masters/index.html"');
  subHtml = subHtml.replace(/href="Healers\/index\.html"/g, 'href="../Healers/index.html"');
  subHtml = subHtml.replace(/href="Trainee\/index\.html"/g, 'href="../Trainee/index.html"');
  subHtml = subHtml.replace(/href="Devotee\/index\.html"/g, 'href="../Devotee/index.html"');
  subHtml = subHtml.replace(/src="GOLI_GYAN_FOR_SEEKERS\.html"/g, 'src="../GOLI_GYAN_FOR_SEEKERS.html"');

  // Set body data attributes
  subHtml = subHtml.replace(/<body[^>]*>/, `<body data-portal-role="${p.role}" class="portal-${p.role.toLowerCase()}">`);

  // Update document title
  subHtml = subHtml.replace(/<title>.*?<\/title>/, `<title>${p.title} • Shree Spritual Karim Sansthan</title>`);

  const destFile = path.join(dirPath, 'index.html');
  fs.writeFileSync(destFile, subHtml, 'utf8');
  console.log(`✅ Synchronized portal: ${p.dir}/index.html (${p.role})`);
});

console.log('🎉 All portals built and synchronized successfully!');
