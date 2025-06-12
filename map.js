const startWidthMap = 736;
const startHeightMap = 552;
const levelBtns = [
    { id: 'firstLevelBtn', startX: 188, startY: 152, text: "1" },
    { id: 'secondLevelBtn', startX: 336, startY: 215, text: "2" }
];

function updateAllButtons() {
    const map = document.getElementById('map');
    const newWidthMap = map.clientWidth;
    const newHeightMap = map.clientHeight;
    
    levelBtns.forEach(btnData => {
        const btn = document.getElementById(btnData.id);
        const newX = btnData.startX * (newWidthMap / startWidthMap);
        const newY = btnData.startY * (newHeightMap / startHeightMap);
        
        btn.style.left = `${newX}px`;
        btn.style.top = `${newY}px`;
        const scale = newWidthMap / startWidthMap;
        btn.style.transform = `translate(-50%, -50%) scale(${scale})`;
        btn.textContent = btnData.text;
    });
}

window.addEventListener('load', updateAllButtons);
window.addEventListener('resize', updateAllButtons);