document.addEventListener("DOMContentLoaded", () => {
    "use strict";

    const $ = (s, r = document) => r.querySelector(s);
    const $$ = (s, r = document) => [...r.querySelectorAll(s)];
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

    const pitch = $("#pitch");
    const bench = $("#bench");
    const emptyEl = $("#empty");
    const searchEl = $("#search");
    const dialog = $("#dialog");
    const langBtn = $("#langBtn");

    if (!pitch || typeof SQUAD === "undefined" || typeof STAFF === "undefined" || !Array.isArray(SQUAD) || !Array.isArray(STAFF)) {
        console.error("تعذّر تحميل بيانات اللاعبين أو عناصر الصفحة.");
        return;
    }

    const formations = typeof FORMATIONS !== "undefined" ? FORMATIONS : {};
    const translations = {
        ar: {
            searchLabel: "ابحث عن لاعب",
            ph: "ابحث عن لاعب أو نادٍ...",
            langAria: "التبديل إلى الإنجليزية",
            pitchLabel: "تشكيل المنتخب",
            family: "العائلة الهاشمية",
            king: "عبدالله الثاني",
            kingRole: "جلالة الملك",
            kingAlt: "جلالة الملك عبدالله الثاني",
            prince: "الحسين بن عبدالله الثاني",
            princeRole: "سمو ولي العهد",
            princeAlt: "سمو ولي العهد الحسين بن عبدالله الثاني",
            staff: "أبرز المدربين ",
            bench: "دكة البدلاء",
            hint: "اضغط على أي لاعب في الملعب أو الدكة لعرض تفاصيله",
            empty: "لا يوجد لاعب مطابق. جرّب اسماً أو نادياً آخر.",
            position: "المركز",
            club: "النادي",
            age: "العمر",
            nationality: "الجنسية",
            period: "فترة التدريب",
            captain: "قائد المنتخب",
            close: "إغلاق",
            year: "سنة",
            formerCoach: "المدرب السابق",
            allPlayers: "جميع اللاعبين"
        },
        en: {
            searchLabel: "Search for a player",
            ph: "Search players or clubs...",
            langAria: "Switch to Arabic",
            pitchLabel: "Jordan national team formation",
            family: "The Hashemite Family",
            king: "Abdullah II",
            kingRole: "His Majesty the King",
            kingAlt: "His Majesty King Abdullah II",
            prince: "Hussein bin Abdullah II",
            princeRole: "Crown Prince",
            princeAlt: "His Royal Highness Crown Prince Hussein",
            staff: "Coaching Staff",
            bench: "Substitutes",
            hint: "Select a player on the pitch or bench to view details",
            empty: "No matching player. Try another name or club.",
            position: "Position",
            club: "Club",
            age: "Age",
            nationality: "Nationality",
            period: "Coaching period",
            captain: "Team Captain",
            close: "Close",
            year: "years",
            formerCoach: "Former coach",
            allPlayers: "All players"
        }
    };

    const englishPlayers = typeof EN !== "undefined" ? EN : {};
    let language = "ar";
    let currentFormation = "4-3-3";
    let closing = false;
    let searchQuery = "";
    let lineup = Array(11).fill(null);

    const age = iso => {
        if (!iso) return "—";
        const [y, mo, d] = iso.split("-").map(Number);
        const now = new Date();
        let result = now.getFullYear() - y;
        if (now.getMonth() + 1 < mo || (now.getMonth() + 1 === mo && now.getDate() < d)) result--;
        return result;
    };

    const t = key => translations[language][key] || key;
    const escapeHTML = value => String(value ?? "").replace(/[&<>"']/g, ch => ({
        "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    }[ch]));

    const playerText = (player, field) => {
        if (language === "ar") return player[field] || "";
        const translated = englishPlayers[player.img];
        if (!translated) return player[field] || "";
        return field === "name" ? translated[0] :
            field === "pos" ? translated[1] :
            field === "club" ? translated[2] : player[field] || "";
    };

    const staffText = (member, field) => {
        if (language === "en" && member.en?.[field]) return member.en[field];
        return member[field] || "";
    };

    const currentCoords = () => formations[currentFormation] || formations["4-3-3"];

    const initialLineup = () => {
        lineup = Array(11).fill(null);
        SQUAD.forEach((player, index) => {
            if (Number.isInteger(player.xi) && player.xi >= 0 && player.xi < 11) {
                lineup[player.xi] = index;
            }
        });
    };

    const positionMarkup = (slot, playerIndex, coords) => {
        const player = SQUAD[playerIndex];
        if (!player) return ""; // الحماية في حال عدم وجود لاعب مخصص للخانة
        const xy = coords[slot] || [50, 50];
        const searchable = `${playerText(player, "name")} ${playerText(player, "pos")} ${playerText(player, "club")}`;

        return `
            <button type="button" class="pl pin" data-slot="${slot}" data-i="${playerIndex}" data-search="${escapeHTML(searchable)}"
                style="--x:${xy[0]}%;--y:${xy[1]}%;--d:${slot * 45}ms"
                aria-label="${escapeHTML(`${playerText(player, "name")}, ${playerText(player, "pos")}`)}">
                <span class="face">
                    <img src="players/${escapeHTML(player.img)}" alt="" width="76" height="76" loading="lazy">
                    ${player.captain ? `<i class="cap" title="${t("captain")}">C</i>` : ""}
                </span>
                <span class="name">${escapeHTML(playerText(player, "name"))}</span>
            </button>`;
    };

    const benchMarkup = (player, index) => {
        const ageValue = age(player.born);
        const searchable = `${playerText(player, "name")} ${playerText(player, "pos")} ${playerText(player, "club")}`;
        return `
            <button type="button" class="pl sub" data-i="${index}" data-search="${escapeHTML(searchable)}" style="--k:${index}">
                <img src="players/${escapeHTML(player.img)}" alt="" width="52" height="52" loading="lazy">
                <span><strong>${escapeHTML(playerText(player, "name"))}</strong>
                <small>${escapeHTML(playerText(player, "pos"))} • <b class="num" data-to="${ageValue}">${ageValue}</b> ${t("year")}</small></span>
            </button>`;
    };

    const renderPitch = (animate = false) => {
        const coords = currentCoords();
        pitch.innerHTML =
            '<span class="center" aria-hidden="true"></span><span class="goal" aria-hidden="true"></span>' +
            lineup.map((playerIndex, slot) => positionMarkup(slot, playerIndex, coords)).join("");
        
        if (animate && !reduced) {
            pitch.classList.remove("in");
            requestAnimationFrame(() => pitch.classList.add("in"));
        } else {
            pitch.classList.add("in");
        }
        applySearch();
    };

    const renderBench = () => {
        const starters = new Set(lineup.filter(index => index !== null));
        bench.innerHTML = SQUAD.map((player, index) => starters.has(index) ? "" : benchMarkup(player, index)).join("");
        applySearch();
    };

    const renderStaff = () => {
        $("#staff").innerHTML = STAFF.map((member, index) => `
            <button type="button" class="sub staff-item" data-staff="${index}" style="--k:${index}">
                <img src="${escapeHTML(member.img)}" alt="" width="52" height="52" loading="lazy">
                <span><strong>${escapeHTML(staffText(member, "name"))}</strong>
                <small>${escapeHTML(staffText(member, "tag"))} •
                <b class="num" data-to="${age(member.born)}">${age(member.born)}</b> ${t("year")}</small></span>
            </button>`).join("");
    };

    const applySearch = () => {
        let found = 0;
        $$(".pl").forEach(element => {
            const text = norm(element.dataset.search || "");
            const matches = !searchQuery || text.includes(searchQuery);
            element.classList.toggle("dim", !matches);
            element.classList.toggle("match", Boolean(searchQuery) && matches);
            if (matches) found++;
        });
        emptyEl.hidden = found > 0;
    };

    const norm = value => String(value)
        .normalize("NFD").replace(/[\u0300-\u036f\u064B-\u065F\u0670\u0640]/g, "")
        .replace(/[أإآ]/g, "ا").replace(/ى/g, "ي").replace(/ة/g, "ه").toLowerCase();

    const updateStaticLanguage = () => {
        document.documentElement.lang = language;
        document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
        $$("[data-i18n]").forEach(el => {
            const key = el.dataset.i18n;
            if (translations[language][key]) el.textContent = t(key);
        });
        $$("[data-i18n-ph]").forEach(el => el.placeholder = t(el.dataset.i18nPh));
        $$("[data-i18n-aria]").forEach(el => el.setAttribute("aria-label", t(el.dataset.i18nAria)));
        $$("[data-i18n-alt]").forEach(el => el.alt = t(el.dataset.i18nAlt));
        $("#empty").textContent = t("empty");
        langBtn.textContent = language === "ar" ? "EN" : "ع";
        langBtn.setAttribute("aria-label", t("langAria"));
        document.title = language === "ar" ? "النشامى - المنتخب الأردني" : "Al-Nashama - Jordan National Team";
        searchEl.value = searchEl.value;
        renderPitch();
        renderBench();
        renderStaff();
    };

    const openPlayer = player => {
        const playerAge = age(player.born);
        $("#dialogBody").innerHTML = `
            <img src="players/${escapeHTML(player.img)}" alt="${escapeHTML(playerText(player, "name"))}">
            <div class="d-info">
                <h3>${escapeHTML(playerText(player, "name"))}</h3>
                ${player.captain ? `<span class="badge">${t("captain")}</span>` : ""}
                <dl>
                    <div><dt>${t("position")}</dt><dd>${escapeHTML(playerText(player, "pos"))}</dd></div>
                    <div><dt>${t("club")}</dt><dd>${escapeHTML(playerText(player, "club"))}</dd></div>
                    <div><dt>${t("age")}</dt><dd><b class="num">${playerAge}</b> ${t("year")}</dd></div>
                </dl>
            </div>`;
        dialog.showModal();
    };

    const openStaff = member => {
        $("#dialogBody").innerHTML = `
            <img src="${escapeHTML(member.img)}" alt="${escapeHTML(staffText(member, "name"))}">
            <div class="d-info">
                <h3>${escapeHTML(staffText(member, "name"))}</h3>
                <dl>
                    <div><dt>${t("nationality")}</dt><dd>${escapeHTML(staffText(member, "nation"))}</dd></div>
                    <div><dt>${t("age")}</dt><dd>${age(member.born)} ${t("year")}</dd></div>
                    <div><dt>${t("period")}</dt><dd>${escapeHTML(staffText(member, "period"))}</dd></div>
                </dl>
                ${staffText(member, "quote") ? `<blockquote class="d-quote">“${escapeHTML(staffText(member, "quote"))}”</blockquote>` : ""}
            </div>`;
        dialog.showModal();
    };

    const closeModal = target => {
        if (!target.open || closing) return;
        closing = true;
        target.classList.add("closing");
        setTimeout(() => {
            target.classList.remove("closing");
            target.close();
            closing = false;
        }, reduced ? 0 : 230);
    };

    // Loader
    const loader = $("#loader");
    const startedAt = performance.now();
    document.body.style.overflow = "hidden";
    const hideLoader = () => {
        const delay = Math.max(0, 500 - (performance.now() - startedAt));
        setTimeout(() => {
            loader?.classList.add("hidden");
            document.body.classList.add("ready");
            document.body.style.overflow = "";
            setTimeout(() => loader?.remove(), 800);
        }, delay);
    };
    if (document.readyState === "complete") hideLoader();
    else window.addEventListener("load", hideLoader, { once: true });

    initialLineup();
    renderPitch();
    renderBench();
    renderStaff();

    // تبديل الخطة
    $$(".seg button").forEach(button => {
        button.addEventListener("click", () => {
            const next = button.dataset.f;
            if (!formations[next] || next === currentFormation) return;
            currentFormation = next;
            $$(".seg button").forEach(item => item.classList.toggle("active", item === button));
            const coords = currentCoords();
            $$(".pin", pitch).forEach((pin, slot) => {
                pin.style.setProperty("--x", `${coords[slot][0]}%`);
                pin.style.setProperty("--y", `${coords[slot][1]}%`);
            });
            pitch.dataset.formation = next;
        });
    });

    pitch.addEventListener("click", event => {
        const pin = event.target.closest(".pin");
        if (pin && pin.dataset.i !== undefined) openPlayer(SQUAD[Number(pin.dataset.i)]);
    });

    searchEl.addEventListener("input", () => {
        searchQuery = norm(searchEl.value.trim());
        applySearch();
    });

    document.addEventListener("click", event => {
        const staffButton = event.target.closest("[data-staff]");
        if (staffButton) {
            openStaff(STAFF[Number(staffButton.dataset.staff)]);
            return;
        }
        const playerButton = event.target.closest("#bench .pl");
        if (playerButton) openPlayer(SQUAD[Number(playerButton.dataset.i)]);
    });

    [dialog].forEach(modal => {
        $(".close", modal).addEventListener("click", () => closeModal(modal));
        modal.addEventListener("click", event => {
            if (event.target === modal) closeModal(modal);
        });
        modal.addEventListener("cancel", event => {
            event.preventDefault();
            closeModal(modal);
        });
    });

    langBtn.addEventListener("click", () => {
        language = language === "ar" ? "en" : "ar";
        updateStaticLanguage();
    });

    const toTop = $("#backToTop");
    let ticking = false;
    window.addEventListener("scroll", () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
            ticking = false;
            toTop.classList.toggle("active", window.scrollY > 400);
        });
    }, { passive: true });

    updateStaticLanguage();
});