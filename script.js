document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const queryInput = document.getElementById('queryInput');
    const submitBtn = document.getElementById('submitBtn');
    const resultOutput = document.getElementById('resultOutput');
    const resultCard = document.getElementById('resultCard');
    const chips = document.querySelectorAll('.chip');

    // Dashboard Elements
    const memberNameInput = document.getElementById('memberName');
    const memberGenderInput = document.getElementById('memberGender');
    const addMemberBtn = document.getElementById('addMemberBtn');
    const membersList = document.getElementById('membersList');

    const parentNameInput = document.getElementById('parentName');
    const childNameInput = document.getElementById('childName');
    const addRelBtn = document.getElementById('addRelBtn');

    // Visualizer Elements
    const visualizerSvg = document.getElementById('visualizerSvg');
    const visualizerPlaceholder = document.querySelector('.visualizer-placeholder');

    // Initialization
    loadMembers();
    drawGraph();

    // --- Query Logic ---
    async function executeQuery(query) {
        if (!query.trim()) return;

        submitBtn.disabled = true;
        submitBtn.classList.add('loading');
        resultCard.classList.remove('active');
        resultOutput.innerHTML = '<span class="placeholder-text">Consulting logic engine...</span>';

        try {
            const response = await fetch('/query', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query })
            });

            const data = await response.json();

            if (data.error) {
                resultOutput.innerHTML = `<span style="color: #f87171;">Error: ${data.details || data.error}</span>`;
            } else {
                resultOutput.innerText = data.result || 'No results found.';
                resultCard.classList.add('active');
                // Refresh graph in case of data changes
                drawGraph();
            }
        } catch (err) {
            resultOutput.innerHTML = '<span style="color: #f87171;">System error. Engine offline.</span>';
        } finally {
            submitBtn.disabled = false;
            submitBtn.classList.remove('loading');
        }
    }

    submitBtn.addEventListener('click', () => executeQuery(queryInput.value));
    queryInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') executeQuery(queryInput.value);
    });

    chips.forEach(chip => {
        chip.addEventListener('click', () => {
            queryInput.value = chip.innerText;
            executeQuery(chip.innerText);
        });
    });

    // --- Management Logic ---
    async function loadMembers() {
        try {
            const res = await fetch('/api/members');
            const data = await res.json();
            membersList.innerHTML = '';
            (data.members || []).forEach(m => {
                const li = document.createElement('li');
                li.className = m.gender;
                li.innerHTML = `<span>${m.name}</span> <i class="fas fa-user-circle gender-icon"></i>`;
                membersList.appendChild(li);
            });
        } catch (e) {
            console.error('Failed to load members', e);
        }
    }

    addMemberBtn.addEventListener('click', async () => {
        const name = memberNameInput.value.trim();
        const gender = memberGenderInput.value;
        if (!name) return;

        addMemberBtn.disabled = true;
        try {
            const res = await fetch('/api/add-member', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, gender })
            });

            if (res.ok) {
                memberNameInput.value = '';
                loadMembers();
                drawGraph();
            }
        } catch (e) {
            console.error('Add member error', e);
        } finally {
            addMemberBtn.disabled = false;
        }
    });

    addRelBtn.addEventListener('click', async () => {
        const p = parentNameInput.value.trim();
        const c = childNameInput.value.trim();
        if (!p || !c) return;

        addRelBtn.disabled = true;
        try {
            const res = await fetch('/api/add-relationship', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ parent: p, child: c })
            });

            if (res.ok) {
                parentNameInput.value = '';
                childNameInput.value = '';
                drawGraph();
            }
        } catch (e) {
            console.error('Add relationship error', e);
        } finally {
            addRelBtn.disabled = false;
        }
    });

    // --- Visualization Logic (Labeled Arrows & Hierarchical) ---
    async function drawGraph() {
        try {
            const res = await fetch('/api/structure');
            const { links } = await res.json();

            if (!links || links.length === 0) {
                visualizerPlaceholder.style.display = 'block';
                visualizerSvg.innerHTML = '';
                return;
            }

            visualizerPlaceholder.style.display = 'none';
            visualizerSvg.innerHTML = '';

            // Add SVG Markers for Arrows
            const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
            const marker = document.createElementNS('http://www.w3.org/2000/svg', 'marker');
            marker.setAttribute('id', 'arrowhead');
            marker.setAttribute('viewBox', '0 0 10 10');
            marker.setAttribute('refX', '18');
            marker.setAttribute('refY', '5');
            marker.setAttribute('markerWidth', '6');
            marker.setAttribute('markerHeight', '6');
            marker.setAttribute('orient', 'auto-start-reverse');

            const markerPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            markerPath.setAttribute('d', 'M 0 0 L 10 5 L 0 10 z');
            markerPath.setAttribute('fill', 'var(--accent-primary)');
            marker.appendChild(markerPath);
            defs.appendChild(marker);
            visualizerSvg.appendChild(defs);

            const width = visualizerSvg.clientWidth || 300;
            const height = visualizerSvg.clientHeight || 500;
            const nodes = {};

            // Build Node Dictionary & Hierarchy
            links.forEach(l => {
                nodes[l.source] = nodes[l.source] || { name: l.source, children: [], parents: [], level: 0 };
                nodes[l.target] = nodes[l.target] || { name: l.target, children: [], parents: [], level: 0 };
                nodes[l.source].children.push(l.target);
                nodes[l.target].parents.push(l.source);
            });

            const nodeList = Object.values(nodes);

            // Basic Level Assignment (Multi-level)
            let changed = true;
            while (changed) {
                changed = false;
                links.forEach(l => {
                    if (nodes[l.target].level <= nodes[l.source].level) {
                        nodes[l.target].level = nodes[l.source].level + 1;
                        changed = true;
                    }
                });
            }

            // Positions
            const levels = {};
            nodeList.forEach(n => {
                levels[n.level] = levels[n.level] || [];
                levels[n.level].push(n);
            });

            Object.entries(levels).forEach(([lvl, members]) => {
                const l = parseInt(lvl);
                members.forEach((n, i) => {
                    n.x = (width / (members.length + 1)) * (i + 1);
                    n.y = 60 + l * 100;
                });
            });

            // Draw Links with Arrows & Labels
            links.forEach(l => {
                const s = nodes[l.source];
                const t = nodes[l.target];
                if (!s || !t) return;

                const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');

                const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                line.setAttribute('x1', s.x);
                line.setAttribute('y1', s.y);
                line.setAttribute('x2', t.x);
                line.setAttribute('y2', t.y);
                line.setAttribute('class', 'link');
                line.setAttribute('marker-end', 'url(#arrowhead)');

                const midX = (s.x + t.x) / 2;
                const midY = (s.y + t.y) / 2;
                const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                text.textContent = l.gender === 'male' ? 'Father' : 'Mother';
                text.setAttribute('x', midX);
                text.setAttribute('y', midY - 4);
                text.setAttribute('text-anchor', 'middle');
                text.style.fontSize = '8px';
                text.style.fill = 'var(--text-secondary)';

                g.appendChild(line);
                g.appendChild(text);
                visualizerSvg.appendChild(g);
            });

            // Draw Nodes
            nodeList.forEach(n => {
                const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
                g.setAttribute('transform', `translate(${n.x},${n.y})`);
                g.setAttribute('class', 'node');

                const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                circle.setAttribute('r', 8);

                const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                text.textContent = n.name;
                text.setAttribute('dy', 22);
                text.setAttribute('text-anchor', 'middle');

                g.appendChild(circle);
                g.appendChild(text);
                visualizerSvg.appendChild(g);
            });

        } catch (e) {
            console.error('Graph drawing error', e);
        }
    }

    // Set SVG size on resize
    window.addEventListener('resize', drawGraph);
});
