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

function initTooltips() {
    const tooltip = document.getElementById("levelTooltip");
    const tooltipContent = tooltip.querySelector(".tooltip-content");
    const levelBtns = document.querySelectorAll(".levelBtn");

    levelBtns.forEach(btn => {
        btn.addEventListener("mouseenter", function(e) {
            const description = this.getAttribute("data-description");
            tooltipContent.textContent = description;

            const btnRect = this.getBoundingClientRect();
            const tooltipRect = tooltip.getBoundingClientRect();

            let leftPos = btnRect.left + (btnRect.width / 2) - (tooltip.offsetWidth / 2);
            let topPos = btnRect.top - tooltip.offsetHeight - 15;

            if (leftPos < 10) leftPos = 10;
            else if (leftPos + tooltip.offsetWidth > window.innerWidth - 10)
                leftPos = window.innerWidth - tooltip.offsetWidth - 10;

            if (topPos < 10) {
                topPos = btnRect.bottom + 15;
                tooltip.classList.add("tooltip-bottom");
            }
            else tooltip.classList.remove("tooltip-bottom");

            tooltip.style.left = leftPos + "px";
            tooltip.style.top = topPos + "px";
            tooltip.classList.add("show");
        });
        btn.addEventListener("mouseleave", function() {
            tooltip.classList.remove("show");
        });
    });
}

window.addEventListener('load', function() {
    updateAllButtons();
    initTooltips();
});
window.addEventListener('resize', updateAllButtons);