let appData = {};
let targetEmployee = null; // Employee clicked, waiting for auth
let unlockedEmployee = null; // Successfully authenticated employee

// Fetch Data
fetch('dashboard_data.json')
    .then(res => res.json())
    .then(data => {
        appData = data.employees;
        renderSidebar();
    });

// 1. Render Left Sidebar
function renderSidebar() {
    const list = document.getElementById('employee-list');
    list.innerHTML = '';
    
    appData.forEach(emp => {
        const isUnlocked = unlockedEmployee && unlockedEmployee.id === emp.id;
        const activeClass = isUnlocked 
            ? 'bg-slate-800 border-brand-500 shadow-md' 
            : 'bg-transparent border-slate-700 hover:border-slate-500 hover:bg-slate-800/50';
        
        list.innerHTML += `
            <div onclick="initiateAuth('${emp.id}')" class="cursor-pointer border ${activeClass} rounded-lg p-4 transition-all duration-200">
                <div class="flex justify-between items-center mb-2">
                    <span class="font-bold text-lg text-white">${emp.name} <span class="text-slate-500 text-sm font-mono">(${emp.id})</span></span>
                    ${isUnlocked ? '<span class="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded font-bold">UNLOCKED</span>' : '<span class="text-xs bg-slate-700 text-slate-400 px-2 py-1 rounded font-bold">LOCKED</span>'}
                </div>
                <div class="grid grid-cols-2 gap-2 text-xs text-slate-400 font-mono bg-slate-900/50 p-2 rounded">
                    <div><span class="text-slate-500 block">JOINED</span>${emp.joined_date}</div>
                    <div><span class="text-slate-500 block">LEFT</span>${emp.left_date}</div>
                </div>
            </div>
        `;
    });
}

// 2. Authentication Flow
function initiateAuth(empId) {
    targetEmployee = appData.find(e => e.id === empId);
    
    // If they click an already unlocked employee, just show the workspace
    if (unlockedEmployee && unlockedEmployee.id === targetEmployee.id) return;
    
    document.getElementById('auth-target-name').innerText = `Target: ${targetEmployee.name} (${targetEmployee.id})`;
    document.getElementById('auth-id').value = '';
    document.getElementById('auth-pass').value = '';
    document.getElementById('auth-error').classList.add('hidden');
    document.getElementById('auth-modal').classList.remove('hidden');
}

function closeAuthModal() {
    document.getElementById('auth-modal').classList.add('hidden');
    targetEmployee = null;
}

function submitAuth() {
    const inputId = document.getElementById('auth-id').value;
    const inputPass = document.getElementById('auth-pass').value;

    // Check credentials against JSON data
    if (inputId === targetEmployee.auth.incoming_id && inputPass === targetEmployee.auth.password) {
        unlockedEmployee = targetEmployee;
        document.getElementById('auth-modal').classList.add('hidden');
        renderSidebar(); // Update border to unlocked
        renderWorkspace();
    } else {
        // Auth failed
        const err = document.getElementById('auth-error');
        err.classList.remove('hidden');
        err.classList.add('animate-pulse');
        setTimeout(() => err.classList.remove('animate-pulse'), 500);
    }
}

// 3. Render Secure Timeline Workspace
function renderWorkspace() {
    document.getElementById('welcome-screen').classList.add('hidden');
    const container = document.getElementById('workspace-container');
    container.classList.remove('hidden');
    
    // Sort timeline months
    const months = Object.keys(unlockedEmployee.timeline).sort((a, b) => b.localeCompare(a));
    
    container.innerHTML = `
        <div class="bg-slate-800 border border-slate-700 rounded-xl p-8 mb-8 flex items-center justify-between shadow-lg relative overflow-hidden">
            <div class="absolute top-0 right-0 w-32 h-32 bg-brand-500/10 rounded-full blur-3xl"></div>
            <div>
                <div class="text-4xl font-extrabold text-white tracking-tight mb-2">${unlockedEmployee.name}</div>
                <div class="text-brand-500 font-mono font-bold">${unlockedEmployee.id} // ${unlockedEmployee.role}</div>
            </div>
            <div class="text-right">
                <div class="text-xs text-slate-400 uppercase tracking-widest font-bold mb-1">Handover Window</div>
                <div class="text-lg text-slate-200 font-semibold">${unlockedEmployee.joined_date} — ${unlockedEmployee.left_date}</div>
            </div>
        </div>
        
        <div class="flex justify-between items-center mb-6">
            <h3 class="text-lg font-bold text-slate-200 uppercase tracking-wide flex items-center gap-2">
                <span class="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span> Decrypted Timeline
            </h3>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            ${months.map(month => `
                <div onclick="openWorkbook('${month}')" class="bg-slate-800 border border-slate-700 hover:border-brand-500 rounded-xl p-6 cursor-pointer shadow-md hover:shadow-xl hover:shadow-brand-500/10 transform hover:-translate-y-1 transition-all duration-200 group">
                    <div class="text-sm text-slate-400 font-bold uppercase tracking-widest mb-2 group-hover:text-brand-400 transition-colors">Period</div>
                    <div class="text-2xl font-extrabold text-white group-hover:text-brand-500 transition-colors">${month}</div>
                </div>
            `).join('')}
        </div>
    `;
}

// 4. Open Slide-Out Workbook
function openWorkbook(month) {
    const drawer = document.getElementById('workbook-drawer');
    const title = document.getElementById('workbook-title');
    const content = document.getElementById('workbook-content');
    
    title.innerText = `WORKBOOK [${month}]`;
    const monthData = unlockedEmployee.timeline[month];
    content.innerHTML = '';
    
    Object.keys(monthData).forEach(category => {
        let itemsHtml = monthData[category].map(item => `
            <div class="flex justify-between items-center bg-slate-900 border border-slate-800 p-3 rounded mt-2 hover:border-brand-500/50 transition-colors">
                <span class="text-sm text-slate-300 font-medium">${item.title}</span>
                <a href="${item.url}" target="_blank" class="text-xs font-bold text-brand-500 hover:text-brand-400 hover:underline flex items-center gap-1 bg-brand-500/10 px-2 py-1 rounded">View</a>
            </div>
        `).join('');
        
        content.innerHTML += `
            <div class="mb-6">
                <h4 class="font-bold text-white border-b border-slate-700 pb-2 mb-3 flex items-center gap-2 uppercase text-sm tracking-wider">
                    <span class="text-brand-500">❖</span> ${category}
                </h4>
                ${itemsHtml}
            </div>
        `;
    });
    
    drawer.classList.remove('translate-x-full');
}

// Close Drawer Logic
document.getElementById('close-drawer').onclick = () => {
    document.getElementById('workbook-drawer').classList.add('translate-x-full');
};