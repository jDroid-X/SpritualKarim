const fs = require('fs');
const path = require('path');

const webRoot = path.resolve('c:/Users/jiten/jAnitGravity/SpritualKarim/SpritualKarimWeb');
const timestamp = Date.now();

// Single Source of Truth (SSOT) Port Configuration
let appConfig = null;
try {
  appConfig = require('./js/config/appConfig');
} catch (e) {}
const SSOT_PORT = (appConfig && appConfig.server && appConfig.server.port) || 8085;
const SSOT_URL = (appConfig && appConfig.server && appConfig.server.localUrl) || `http://localhost:${SSOT_PORT}`;
console.log(`[SSOT] Synchronizing with active server port: ${SSOT_PORT} (${SSOT_URL})`);

// Read root index.html
let indexHtml = fs.readFileSync(path.join(webRoot, 'index.html'), 'utf8');

// Ensure unwanted legacy ports are replaced with active SSOT port
indexHtml = indexHtml.replace(/http:\/\/localhost:(?:8080|8086|8087|8088)\//g, `${SSOT_URL}/`);

// Ensure proper cache-busting query parameter (?v=...)
indexHtml = indexHtml.replace(/href="css\/profile-admin\.css[•?][^"]*"/g, `href="css/profile-admin.css?v=sk_v5_${timestamp}"`);
indexHtml = indexHtml.replace(/src="js\/config\/appConfig\.js[•?][^"]*"/g, `src="js/config/appConfig.js?v=sk_v5_${timestamp}"`);
indexHtml = indexHtml.replace(/src="js\/utils\/sanitizer\.js[•?][^"]*"/g, `src="js/utils/sanitizer.js?v=sk_v5_${timestamp}"`);
indexHtml = indexHtml.replace(/src="js\/utils\/FormValidator\.js[•?][^"]*"/g, `src="js/utils/FormValidator.js?v=sk_v5_${timestamp}"`);
indexHtml = indexHtml.replace(/src="js\/profile-admin-header\.js[•?][^"]*"/g, `src="js/profile-admin-header.js?v=sk_v5_${timestamp}"`);
indexHtml = indexHtml.replace(/src="js\/models\/ScreenAuthMatrix\.js[•?][^"]*"/g, `src="js/models/ScreenAuthMatrix.js?v=sk_v5_${timestamp}"`);
indexHtml = indexHtml.replace(/src="js\/models\/ProfileModel\.js[•?][^"]*"/g, `src="js/models/ProfileModel.js?v=sk_v5_${timestamp}"`);
indexHtml = indexHtml.replace(/src="js\/models\/MetadataCountEngine\.js[•?][^"]*"/g, `src="js/models/MetadataCountEngine.js?v=sk_v5_${timestamp}"`);
indexHtml = indexHtml.replace(/src="js\/models\/SadhanaRemedyModel\.js[•?][^"]*"/g, `src="js/models/SadhanaRemedyModel.js?v=sk_v5_${timestamp}"`);
indexHtml = indexHtml.replace(/src="js\/models\/FirebaseSyncEngine\.js[•?][^"]*"/g, `src="js/models/FirebaseSyncEngine.js?v=sk_v5_${timestamp}"`);
indexHtml = indexHtml.replace(/src="js\/views\/ProfileView\.js[•?][^"]*"/g, `src="js/views/ProfileView.js?v=sk_v5_${timestamp}"`);
indexHtml = indexHtml.replace(/src="js\/views\/ProfileView2\.js[•?][^"]*"/g, `src="js/views/ProfileView2.js?v=sk_v5_${timestamp}"`);
indexHtml = indexHtml.replace(/src="js\/views\/SadhanaRemedyView\.js[•?][^"]*"/g, `src="js/views/SadhanaRemedyView.js?v=sk_v5_${timestamp}"`);
indexHtml = indexHtml.replace(/src="js\/controllers\/ProfileController\.js[•?][^"]*"/g, `src="js/controllers/ProfileController.js?v=sk_v5_${timestamp}"`);
indexHtml = indexHtml.replace(/src="js\/controllers\/ProfileController2\.js[•?][^"]*"/g, `src="js/controllers/ProfileController2.js?v=sk_v5_${timestamp}"`);
indexHtml = indexHtml.replace(/src="js\/controllers\/SettingsModalController\.js[•?][^"]*"/g, `src="js/controllers/SettingsModalController.js?v=sk_v5_${timestamp}"`);
indexHtml = indexHtml.replace(/src="js\/controllers\/SadhanaRemedyController\.js[•?][^"]*"/g, `src="js/controllers/SadhanaRemedyController.js?v=sk_v5_${timestamp}"`);
indexHtml = indexHtml.replace(/src="js\/profile-admin-bootstrap\.js[•?][^"]*"/g, `src="js/profile-admin-bootstrap.js?v=sk_v5_${timestamp}"`);

fs.writeFileSync(path.join(webRoot, 'index.html'), indexHtml, 'utf8');
console.log('✅ Updated root index.html with fresh cache query');

// Portals configuration
const portals = [
  { dir: 'Masters', role: 'ADMIN', title: 'Master Admin Portal', badgeClass: 'badge-admin', badgeText: '👑 MASTER CONTROL' },
  { dir: 'Healers', role: 'HEALER', title: 'Healers Portal', badgeClass: 'badge-healer', badgeText: '🛡️ CERTIFIED HEALER' },
  { dir: 'Trainee', role: 'TRAINEE', title: 'Trainee Sadhak Portal', badgeClass: 'badge-trainee', badgeText: '📿 TRAINEE SADHAK' },
  { dir: 'Devotee', role: 'DEVOTEE', title: 'Devotee Portal', badgeClass: 'badge-devotee', badgeText: '🌟 DEVOTEE' },
  { dir: 'Seeker', role: 'DEVOTEE', title: 'Seeker Portal', badgeClass: 'badge-devotee', badgeText: '🔍 SEEKER' }
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
  subHtml = subHtml.replace(/href="login\.html"/g, 'href="../login.html"');
  subHtml = subHtml.replace(/href="join\.html"/g, 'href="../join.html"');
  subHtml = subHtml.replace(/href="logout\.html"/g, 'href="../logout.html"');
  subHtml = subHtml.replace(/href="Masters\/index\.html"/g, 'href="../Masters/index.html"');
  subHtml = subHtml.replace(/href="Healers\/index\.html"/g, 'href="../Healers/index.html"');
  subHtml = subHtml.replace(/href="Trainee\/index\.html"/g, 'href="../Trainee/index.html"');
  subHtml = subHtml.replace(/href="Devotee\/index\.html"/g, 'href="../Devotee/index.html"');
  subHtml = subHtml.replace(/href="Seeker\/index\.html"/g, 'href="../Seeker/index.html"');
  subHtml = subHtml.replace(/href="Public\/index\.html"/g, 'href="../Public/index.html"');
  subHtml = subHtml.replace(/href="docs\//g, 'href="../docs/');
  subHtml = subHtml.replace(/src="GOLI_GYAN_FOR_SEEKERS\.html"/g, 'src="../GOLI_GYAN_FOR_SEEKERS.html"');
  subHtml = subHtml.replace(/href="GOLI_GYAN_FOR_SEEKERS\.html"/g, 'href="../GOLI_GYAN_FOR_SEEKERS.html"');
  subHtml = subHtml.replace(/src="rbac-admin\.html"/g, 'src="../rbac-admin.html"');
  subHtml = subHtml.replace(/href="rbac-admin\.html"/g, 'href="../rbac-admin.html"');

  // Set body data attributes
  subHtml = subHtml.replace(/<body[^>]*>/, `<body data-portal-role="${p.role}" class="portal-${p.role.toLowerCase()}">`);

  // Update document title
  subHtml = subHtml.replace(/<title>[^<]*<\/title>/, `<title>${p.title} • Shree Spritual Karim Sansthan</title>`);

  // Update header badge
  subHtml = subHtml.replace(/<span[^>]*class="header-portal-badge[^"]*"[^>]*>[^<]*<\/span>/, `<span id="header-portal-badge" class="header-portal-badge ${p.badgeClass}">${p.badgeText}</span>`);

  // Mark active portal link in sidebar
  subHtml = subHtml.replace(/class="sub-portal-link active"/g, 'class="sub-portal-link"');
  subHtml = subHtml.replace(new RegExp(`href="\.\./${p.dir}\/index\.html" class="sub-portal-link"`, 'g'), `href="../${p.dir}/index.html" class="sub-portal-link active"`);

  fs.writeFileSync(path.join(dirPath, 'index.html'), subHtml, 'utf8');
  console.log(`✅ Synchronized portal: ${p.dir}/index.html (${p.role})`);
});

// Also update Public if it exists
['Public'].forEach(portalDir => {
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

// Also mirror to Frontend directory
const frontendDir = path.join(webRoot, 'Frontend');
if (fs.existsSync(frontendDir)) {
  // Mirror index.html
  fs.copyFileSync(path.join(webRoot, 'index.html'), path.join(frontendDir, 'index.html'));
  
  // Mirror css/profile-admin.css
  const fCssDir = path.join(frontendDir, 'css');
  if (!fs.existsSync(fCssDir)) fs.mkdirSync(fCssDir, { recursive: true });
  fs.copyFileSync(path.join(webRoot, 'css', 'profile-admin.css'), path.join(fCssDir, 'profile-admin.css'));
  
  // Mirror js directory files
  function copyDirRecursive(src, dest) {
    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
    const entries = fs.readdirSync(src, { withFileTypes: true });
    for (const entry of entries) {
      const srcPath = path.join(src, entry.name);
      const destPath = path.join(dest, entry.name);
      if (entry.isDirectory()) {
        copyDirRecursive(srcPath, destPath);
      } else {
        fs.copyFileSync(srcPath, destPath);
      }
    }
  }
  copyDirRecursive(path.join(webRoot, 'js'), path.join(frontendDir, 'js'));

  // Mirror sub-portals
  portals.concat([{ dir: 'Public' }]).forEach(p => {
    const srcPortal = path.join(webRoot, p.dir, 'index.html');
    const destPortalDir = path.join(frontendDir, p.dir);
    if (fs.existsSync(srcPortal)) {
      if (!fs.existsSync(destPortalDir)) fs.mkdirSync(destPortalDir, { recursive: true });
      fs.copyFileSync(srcPortal, path.join(destPortalDir, 'index.html'));
    }
  });

  // Mirror login.html, logout.html, join.html, rbac-admin.html to Frontend
  ['login.html', 'logout.html', 'join.html', 'rbac-admin.html'].forEach(file => {
    const src = path.join(webRoot, file);
    if (fs.existsSync(src)) {
      fs.copyFileSync(src, path.join(frontendDir, file));
    }
  });

  console.log('✅ Synchronized Frontend directory with latest root, portals, login, logout, and join');
}

// Helper to rewrite paths for files in sub-portal directories
function rewriteSubportalHtml(html) {
  let sub = html;
  sub = sub.replace(/href="css\//g, 'href="../css/');
  sub = sub.replace(/src="js\//g, 'src="../js/');
  sub = sub.replace(/src="Logo\.png"/g, 'src="../Logo.png"');
  sub = sub.replace(/href="Logo\.png"/g, 'href="../Logo.png"');
  sub = sub.replace(/href="join\.html"/g, 'href="../join.html"');
  sub = sub.replace(/href="login\.html"/g, 'href="../login.html"');
  sub = sub.replace(/href="logout\.html"/g, 'href="../logout.html"');
  sub = sub.replace(/href="index\.html"/g, 'href="../index.html"');
  sub = sub.replace(/href="Masters\/index\.html"/g, 'href="../Masters/index.html"');
  sub = sub.replace(/href="Healers\/index\.html"/g, 'href="../Healers/index.html"');
  sub = sub.replace(/href="Trainee\/index\.html"/g, 'href="../Trainee/index.html"');
  sub = sub.replace(/href="Devotee\/index\.html"/g, 'href="../Devotee/index.html"');
  sub = sub.replace(/href="Seeker\/index\.html"/g, 'href="../Seeker/index.html"');
  sub = sub.replace(/href="Public\/index\.html"/g, 'href="../Public/index.html"');
  sub = sub.replace(/href="rbac-admin\.html"/g, 'href="../rbac-admin.html"');
  sub = sub.replace(/src="rbac-admin\.html"/g, 'src="../rbac-admin.html"');
  return sub;
}

// Mirror login.html, logout.html, join.html, rbac-admin.html to portal subdirectories with path rewriting
portals.forEach(p => {
  ['login.html', 'logout.html', 'join.html', 'rbac-admin.html'].forEach(file => {
    const src = path.join(webRoot, file);
    const dest = path.join(webRoot, p.dir, file);
    if (fs.existsSync(src)) {
      const rawHtml = fs.readFileSync(src, 'utf8');
      const rewritten = rewriteSubportalHtml(rawHtml);
      fs.writeFileSync(dest, rewritten, 'utf8');
    }
  });
});

console.log('🎉 All portals, login/logout actions, and joining steps built and synchronized successfully!');


