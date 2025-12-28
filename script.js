// 1 mock data kind of json
const data = {
    timeline: [
        {
            year: "2008",
            title: "U19 World Cup Glory",
            desc: "Captained India to victory in the U19 World Cup in Malaysia.",
            img: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=500&auto=format&fit=crop&q=60",
            link: "https://en.wikipedia.org/wiki/2008_Under-19_Cricket_World_Cup"
        },
        {
            year: "2011",
            title: "World Cup Winner",
            desc: "Played a crucial role in the ODI World Cup Final against Sri Lanka.",
            img: "https://images.unsplash.com/photo-1624526267942-ab0ff8a3e972?w=500&auto=format&fit=crop&q=60",
            link: "#"
        },
        {
            year: "2014",
            title: "Test Captaincy",
            desc: "Took over the Test captaincy from MS Dhoni during the Australia tour.",
            img: "https://images.unsplash.com/photo-1531415074984-6180260badca?w=500&auto=format&fit=crop&q=60",
            link: "#"
        },
        {
            year: "2023",
            title: "50th ODI Century",
            desc: "Broke Sachin Tendulkar's record by scoring his 50th ODI ton in the WC Semi-Final.",
            img: "https://images.unsplash.com/photo-1562077772-3bd305261997?w=500&auto=format&fit=crop&q=60",
            link: "#"
        }
    ],
    stats: {
        odi: {
            matches: 292,
            runs: 13848,
            average: 58.67,
            hundreds: 50
        },
        test: {
            matches: 113,
            runs: 8848,
            average: 49.15,
            hundreds: 29
        },
        t20: {
            matches: 117,
            runs: 4037,
            average: 51.75,
            hundreds: 1
        }
    },
    gallery: [
        { type: "match", src: "https://images.unsplash.com/photo-1593341646782-e0b495cff86d?w=400", desc: "Cover Drive" },
        { type: "award", src: "https://images.unsplash.com/photo-1624526267942-ab0ff8a3e972?w=400", desc: "Man of the Match" },
        { type: "training", src: "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=400", desc: "Gym Session" },
        { type: "match", src: "https://onecricketnews.akamaized.net/parth-editor/oc-dashboard/news-images-prod/1704377425385_kohl.jpg?type=hq", desc: "Celebration" },
        { type: "award", src: "https://pbs.twimg.com/media/EqT-GLhXcAUhk24.jpg", desc: "ICC Player of Decade" },
        { type: "training", src: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400", desc: "Nets Practice" }
    ]
};

// 2 init everything after page load
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    renderTimeline();
    initCounters();
    initChart('odi');
    renderTable('odi');
    renderGallery('all');
    initParallax();
    initValidation();
});

// dark mode toggle stuff
function initTheme() {
    const toggle = document.getElementById('theme-toggle');
    const body = document.body;
    
    toggle.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        const icon = toggle.querySelector('i');
        if (body.classList.contains('dark-mode')) {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        } else {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
        }
    });
}

// navbar color change on scroll
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        navbar.style.background = 'var(--bg)';
    } else {
        navbar.style.background = 'var(--nav-bg)';
    }
});

// 3 timeline render and modal
function renderTimeline() {
    const root = document.getElementById('timeline-root');
    data.timeline.forEach((item, index) => {
        const side = index % 2 === 0 ? 'left' : 'right';
        const div = document.createElement('div');
        div.className = `timeline-item ${side}`;
        div.innerHTML = `
            <div class="content">
                <h3>${item.year}</h3>
                <p>${item.title}</p>
            </div>
        `;
        // open modal when clicked
        div.addEventListener('click', () => openModal(item));
        root.appendChild(div);
    });
}

const modal = document.getElementById('info-modal');
const closeBtn = document.querySelector('.close-modal');

function openModal(item) {
    document.getElementById('modal-title').innerText = item.title;
    document.getElementById('modal-desc').innerText = item.desc;
    document.getElementById('modal-img').src = item.img;
    document.getElementById('modal-link').href = item.link || '#';
    modal.style.display = 'flex';
}

// close modal logic
closeBtn.onclick = () => modal.style.display = 'none';
window.onclick = (e) => {
    if (e.target == modal) modal.style.display = 'none';
};

// 4 counters animation
function initCounters() {
    const counters = document.querySelectorAll('.counter');
    const speed = 200;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if(entry.isIntersecting) {
                const counter = entry.target;
                const updateCount = () => {
                    const target = +counter.getAttribute('data-target');
                    const count = +counter.innerText;
                    const inc = target / speed;

                    if (count < target) {
                        counter.innerText = Math.ceil(count + inc);
                        setTimeout(updateCount, 20);
                    } else {
                        counter.innerText = target + (target > 1000 ? '+' : '');
                    }
                };
                updateCount();
                observer.unobserve(counter);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(c => observer.observe(c));
}

// 5 chart and stats
let statsChart;

function initChart(format) {
    const ctx = document.getElementById('statsChart').getContext('2d');
    const stats = data.stats[format];
    
    // remove old chart if present
    if (statsChart) statsChart.destroy();

    statsChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Matches', 'Average', 'Hundreds'],
            datasets: [{
                label: `${format.toUpperCase()} Stats`,
                data: [stats.matches, stats.average, stats.hundreds],
                backgroundColor: ['#d4af37', '#005b96', '#1e1e1e'],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: { beginAtZero: true }
            }
        }
    });
}

function renderTable(format) {
    const tbody = document.getElementById('table-body');
    const stats = data.stats[format];
    tbody.innerHTML = '';
    
    const rows = [
        { metric: 'Matches', value: stats.matches },
        { metric: 'Total Runs', value: stats.runs },
        { metric: 'Batting Average', value: stats.average },
        { metric: 'Centuries', value: stats.hundreds }
    ];

    rows.forEach(row => {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td>${row.metric}</td><td>${row.value}</td>`;
        tbody.appendChild(tr);
    });
}

// stats buttons click
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        const format = e.target.getAttribute('data-format');
        initChart(format);
        renderTable(format);
    });
});

// table sort helper
window.sortTable = (n) => {
    const table = document.getElementById("achievements-table");
    let rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
    switching = true;
    dir = "asc"; 
    
    while (switching) {
        switching = false;
        rows = table.rows;
        for (i = 1; i < (rows.length - 1); i++) {
            shouldSwitch = false;
            x = rows[i].getElementsByTagName("TD")[n];
            y = rows[i + 1].getElementsByTagName("TD")[n];
            
            let xVal = isNaN(x.innerHTML) ? x.innerHTML.toLowerCase() : parseFloat(x.innerHTML);
            let yVal = isNaN(y.innerHTML) ? y.innerHTML.toLowerCase() : parseFloat(y.innerHTML);

            if (dir == "asc") {
                if (xVal > yVal) { shouldSwitch = true; break; }
            } else if (dir == "desc") {
                if (xVal < yVal) { shouldSwitch = true; break; }
            }
        }
        if (shouldSwitch) {
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
            switchcount++;
        } else {
            if (switchcount == 0 && dir == "asc") {
                dir = "desc";
                switching = true;
            }
        }
    }
};

// 6 gallery filter and modal
function renderGallery(filter) {
    const root = document.getElementById('gallery-root');
    root.innerHTML = '';
    
    const items = filter === 'all'
        ? data.gallery
        : data.gallery.filter(item => item.type === filter);
    
    items.forEach(item => {
        const div = document.createElement('div');
        div.className = 'gallery-item';
        div.innerHTML = `<img src="${item.src}" alt="${item.desc}" loading="lazy">`;
        
        // show image in modal
        div.addEventListener('click', () => {
            openModal({
                title: 'Gallery Image',
                desc: item.desc,
                img: item.src,
                link: '#'
            });
            document.getElementById('modal-link').style.display = 'none';
        });
        
        root.appendChild(div);
    });
}

document.querySelectorAll('.g-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        document.querySelectorAll('.g-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        renderGallery(e.target.getAttribute('data-filter'));
    });
});

// 7 parallax scroll
function initParallax() {
    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        document.querySelectorAll('.parallax').forEach(el => {
            const speed = el.getAttribute('data-speed');
            el.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });
}

// 8 for validation
function initValidation() {
    const form = document.getElementById('fan-form');
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        let valid = true;
        
        const name = document.getElementById('name');
        if (name.value.length < 3) {
            showError(name, "Name must be at least 3 chars");
            valid = false;
        } else {
            clearError(name);
        }

        const email = document.getElementById('email');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.value)) {
            showError(email, "Enter a valid email");
            valid = false;
        } else {
            clearError(email);
        }

        if (valid) {
            document.getElementById('form-feedback').innerText = "Message sent successfully to Virat!";
            form.reset();
            setTimeout(() => {
                document.getElementById('form-feedback').innerText = "";
            }, 3000);
        }
    });

    function showError(input, msg) {
        input.nextElementSibling.innerText = msg;
        input.style.borderColor = 'red';
    }

    function clearError(input) {
        input.nextElementSibling.innerText = "";
        input.style.borderColor = '#ccc';
    }
}
