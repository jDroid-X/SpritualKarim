const fs = require('fs');
const path = require('path');

const webRoot = path.resolve('c:/Users/jiten/jAnitGravity/SpritualKarim/SpritualKarimWeb');
const timestamp = Date.now();

// Read root index.html
let indexHtml = fs.readFileSync(path.join(webRoot, 'index.html'), 'utf8');

// Ensure proper cache-busting query parameter (?v=...)
indexHtml = indexHtml.replace(/href="css\/profile-admin\.css[•?][^"]*"/g, `href="css/profile-admin.css?v=sk_v5_${timestamp}"`);
indexHtml = indexHtml.replace(/src="js\/profile-admin-header\.js[•?][^"]*"/g, `src="js/profile-admin-header.js?v=sk_v5_${timestamp}"`);
indexHtml = indexHtml.replace(/src="js\/models\/ScreenAuthMatrix\.js[•?][^"]*"/g, `src="js/models/ScreenAuthMatrix.js?v=sk_v5_${timestamp}"`);
indexHtml = indexHtml.replace(/src="js\/models\/ProfileModel\.js[•?][^"]*"/g, `src="js/models/ProfileModel.js?v=sk_v5_${timestamp}"`);
indexHtml = indexHtml.replace(/src="js\/models\/FirebaseSyncEngine\.js[•?][^"]*"/g, `src="js/models/FirebaseSyncEngine.js?v=sk_v5_${timestamp}"`);
indexHtml = indexHtml.replace(/src="js\/views\/ProfileView\.js[•?][^"]*"/g, `src="js/views/ProfileView.js?v=sk_v5_${timestamp}"`);
indexHtml = indexHtml.replace(/src="js\/views\/ProfileView2\.js[•?][^"]*"/g, `src="js/views/ProfileView2.js?v=sk_v5_${timestamp}"`);
indexHtml = indexHtml.replace(/src="js\/controllers\/ProfileController\.js[•?][^"]*"/g, `src="js/controllers/ProfileController.js?v=sk_v5_${timestamp}"`);
indexHtml = indexHtml.replace(/src="js\/controllers\/ProfileController2\.js[•?][^"]*"/g, `src="js/controllers/ProfileController2.js?v=sk_v5_${timestamp}"`);
indexHtml = indexHtml.replace(/src="js\/controllers\/SettingsModalController\.js[•?][^"]*"/g, `src="js/controllers/SettingsModalController.js?v=sk_v5_${timestamp}"`);
indexHtml = indexHtml.replace(/src="js\/profile-admin-bootstrap\.js[•?][^"]*"/g, `src="js/profile-admin-bootstrap.js?v=sk_v5_${timestamp}"`);

fs.writeFileSync(path.join(webRoot, 'index.html'), indexHtml, 'utf8');
console.log('✅ Updated root index.html with fresh cache query');

// Portals configuration
const portals = [
  { dir: 'Masters', role: 'ADMIN', title: 'Master Admin Portal', badgeClass: 'badge-admin', badgeText: '👑 MASTER FOUNDER' },
  { dir: 'Healers', role: 'HEALER', title: 'Healers Portal', badgeClass: 'badge-healer', badgeText: '🛡️ CERTIFIED HEALER' },
  { dir: 'Trainee', role: 'TRAINEE', title: 'Trainee Sadhak Portal', badgeClass: 'badge-trainee', badgeText: '📿 TRAINEE SADHAK' },
  { dir: 'Devotee', role: 'DEVOTEE', title: 'Devotee Portal', badgeClass: 'badge-devotee', badgeText: '🌟 DEVOTEE / SEEKER' }
];

portals.forEach(p => {
  const dirPath = path.join(webRoot, p.dir);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }

  // Adjust relative paths for subdirectories (../css, ../js, ../Logo.png, etc.)
  let subHtml = indexHtml;

  // Replace links and sources to point to parent directory
  subHtml = subHtml.replace(/href="css\//g, 'href="../css/');
  subHtml = subHtml.replace(/src="js\//g, 'src="../js/');
  subHtml = subHtml.replace(/src="Logo\.png"/g, 'src="../Logo.png"');
  subHtml = subHtml.replace(/href="Logo\.png"/g, 'href="../Logo.png"');
  subHtml = subHtml.replace(/href="index\.html"/g, 'href="../index.html"');
  subHtml = subHtml.replace(/href="Masters\/index\.html"/g, 'href="../Masters/index.html"');
  subHtml = subHtml.replace(/href="Healers\/index\.html"/g, 'href="../Healers/index.html"');
  subHtml = subHtml.replace(/href="Trainee\/index\.html"/g, 'href="../Trainee/index.html"');
  subHtml = subHtml.replace(/href="Devotee\/index\.html"/g, 'href="../Devotee/index.html"');
  subHtml = subHtml.replace(/src="GOLI_GYAN_FOR_SEEKERS\.html"/g, 'src="../GOLI_GYAN_FOR_SEEKERS.html"');
  subHtml = subHtml.replace(/href="GOLI_GYAN_FOR_SEEKERS\.html"/g, 'href="../GOLI_GYAN_FOR_SEEKERS.html"');

  // Set body data attributes
  subHtml = subHtml.replace(/<body[^>]*>/, `<body data-portal-role="${p.role}" class="portal-${p.role.toLowerCase()}">`);

  // Update document title
  subHtml = subHtml.replace(/<title>[^<]*<\/title>/, `<title>${p.title} • Shree Spritual Karim Sansthan</title>`);

  // Update header badge
  subHtml = subHtml.replace(/<span class="header-portal-badge"[^>]*>[^<]*<\/span>/, `<span class="header-portal-badge ${p.badgeClass}">${p.badgeText}</span>`);

  // Mark active portal link in sidebar
  subHtml = subHtml.replace(/class="sub-portal-link active"/g, 'class="sub-portal-link"');
  subHtml = subHtml.replace(new RegExp(`href="\.\./${p.dir}\/index\.html" class="sub-portal-link"`, 'g'), `href="../${p.dir}/index.html" class="sub-portal-link active"`);

  fs.writeFileSync(path.join(dirPath, 'index.html'), subHtml, 'utf8');
  console.log(`✅ Synchronized portal: ${p.dir}/index.html (${p.role})`);
});

// Also update Seeker and Public if they exist
['Seeker', 'Public'].forEach(portalDir => {
  const pFile = path.join(webRoot, portalDir, 'index.html');
  if (fs.existsSync(pFile)) {
    let pHtml = fs.readFileSync(pFile, 'utf8');
    pHtml = pHtml.replace(/href="\.\.\/css\/profile-admin\.css[•?][^"]*"/g, `href="../css/profile-admin.css?v=sk_v5_${timestamp}"`);
    pHtml = pHtml.replace(/src="\.\.\/js\/models\/ScreenAuthMatrix\.js[•?][^"]*"/g, `src="../js/models/ScreenAuthMatrix.js?v=sk_v5_${timestamp}"`);
    pHtml = pHtml.replace(/src="\.\.\/js\/models\/ProfileModel\.js[•?][^"]*"/g, `src="../js/models/ProfileModel.js?v=sk_v5_${timestamp}"`);
    pHtml = pHtml.replace(/src="\.\.\/js\/views\/ProfileView\.js[•?][^"]*"/g, `src="../js/views/ProfileView.js?v=sk_v5_${timestamp}"`);
    pHtml = pHtml.replace(/src="\.\.\/js\/views\/ProfileView2\.js[•?][^"]*"/g, `src="../js/views/ProfileView2.js?v=sk_v5_${timestamp}"`);
    pHtml = pHtml.replace(/src="\.\.\/js\/controllers\/ProfileController\.js[•?][^"]*"/g, `src="../js/controllers/ProfileController.js?v=sk_v5_${timestamp}"`);
    pHtml = pHtml.replace(/src="\.\.\/js\/controllers\/ProfileController2\.js[•?][^"]*"/g, `src="../js/controllers/ProfileController2.js?v=sk_v5_${timestamp}"`);
    pHtml = pHtml.replace(/src="\.\.\/js\/profile-admin-bootstrap\.js[•?][^"]*"/g, `src="../js/profile-admin-bootstrap.js?v=sk_v5_${timestamp}"`);
    pHtml = pHtml.replace(/•family=/g, '?family=');
    fs.writeFileSync(pFile, pHtml, 'utf8');
    console.log(`✅ Synchronized portal: ${portalDir}/index.html`);
  }
});

console.log('🎉 All portals built and synchronized successfully!');

