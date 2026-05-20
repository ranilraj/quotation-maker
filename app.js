/* ==========================================================================
   QUICKESTIMATE PREMIUM DESKTOP ROUTER & CALCULATOR ENGINE (app.js)
   Sidebar layout router, real-time keystroke PDF updates, multi-preset loaders,
   precision signature pad trackers, A4 print layout generators, and checkouts.
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  
  // ==========================================================================
  // A. Presets & Trade Definitions
  // ==========================================================================
  const TRADE_PRESETS = {
    painting: {
      name: "🎨 Painting & Polishing",
      items: [
        { desc: "Premium Wall Emulsion Painting (Double Coat)", rate: 18, qty: 1200, unit: "Sq.Ft" },
        { desc: "Ceiling Tractor Emulsion Painting", rate: 12, qty: 800, unit: "Sq.Ft" },
        { desc: "Wall Waterproofing & Primer Coat Application", rate: 8, qty: 1200, unit: "Sq.Ft" },
        { desc: "Main Wooden Door Melamine Polish & Refinishing", rate: 8500, qty: 1, unit: "Nos" },
        { desc: "Metal Window Grills Painting (Gloss Enamel)", rate: 45, qty: 250, unit: "Sq.Ft" }
      ],
      chips: ["Emulsion Coat", "Ceiling Paint", "Waterproofing Primer", "Wood Polish", "Enamel Paint"]
    },
    carpentry: {
      name: "🪚 Carpentry & Woodwork",
      items: [
        { desc: "Modular Kitchen Cabinetry (Waterproof Plywood + Laminate)", rate: 1450, qty: 85, unit: "Sq.Ft" },
        { desc: "Master Bedroom Wardrobe with Premium Soft-Close Slides", rate: 1650, qty: 110, unit: "Sq.Ft" },
        { desc: "Custom Floating TV Console with LED Backlight Grooves", rate: 12000, qty: 1, unit: "Nos" },
        { desc: "Wooden Door Frame & Flush Door Fitting with Premium Lock", rate: 9500, qty: 3, unit: "Nos" }
      ],
      chips: ["Kitchen Cabinet", "Bedroom Wardrobe", "TV Console", "Door Fitting", "Laminate Work"]
    },
    plumbing: {
      name: "🚰 Plumbing Services",
      items: [
        { desc: "Under-sink Piping System & Water Purifier Valve Upgrade", rate: 2400, qty: 1, unit: "Nos" },
        { desc: "Premium Wall-Hung Commode & Concealed Flush Tank Setup", rate: 8500, qty: 2, unit: "Nos" },
        { desc: "Bathroom Hot/Cold Water Mixer Fitting & Shower Head", rate: 3200, qty: 2, unit: "Nos" },
        { desc: "Kitchen/Utility Drain Clog Clearing & Multi-trap Fitment", rate: 1500, qty: 1, unit: "Nos" }
      ],
      chips: ["Sink Piping", "Concealed Commode", "Shower Mixer", "Drain Clog Fix", "Water Heater Setup"]
    },
    electrical: {
      name: "⚡ Electrical Installation",
      items: [
        { desc: "Modular Smart Switchboard Wiring & Faceplate Fitment", rate: 450, qty: 12, unit: "Nos" },
        { desc: "Ceiling Fan Assembly, Unboxing, and Balancing Installation", rate: 350, qty: 6, unit: "Nos" },
        { desc: "Concealed LED Strip Lighting & Profile Channels Framing", rate: 120, qty: 80, unit: "Rft" },
        { desc: "Main Distribution Board & MCB Breakers Replacement (16A/32A)", rate: 6800, qty: 1, unit: "Nos" }
      ],
      chips: ["Smart Switchboard", "Ceiling Fan Setup", "LED Strip Channel", "Concealed Wiring", "MCB Distribution"]
    },
    interior: {
      name: "🛋️ Interior Designing",
      items: [
        { desc: "3D Layout Concept Renderings & Space Walkthroughs", rate: 15000, qty: 1, unit: "Lumpsum" },
        { desc: "False Ceiling Framing & Gypsum Board Layout Fitting", rate: 110, qty: 600, unit: "Sq.Ft" },
        { desc: "Premium Velvet Fabric Accent Wallpaper Decor Installation", rate: 75, qty: 240, unit: "Sq.Ft" },
        { desc: "Designer Spotlight, Track Lights, and Hanging Chandeliers Setup", rate: 4500, qty: 1, unit: "Lumpsum" }
      ],
      chips: ["3D Concept Rendering", "False Ceiling", "Velvet Wallpaper", "Spotlight Assembly", "Consultancy Fee"]
    },
    custom: {
      name: "✨ Custom Estimate",
      items: [
        { desc: "General Site Development & Contracting Labor", rate: 1200, qty: 5, unit: "Days" }
      ],
      chips: ["Site Cleaning", "Supervision Fee", "Material Transport", "Labor Wage"]
    }
  };

  // State Containers (synchronized with LocalStorage)
  let appState = {
    settings: {
      bizName: "Royal Decorators & Painters",
      bizOwner: "Suresh Gowda",
      bizPhone: "9876543210",
      bizEmail: "contact@royaldecors.com",
      bizGST: "29AAAAA0000A1Z5",
      bizAddress: "1st Main Rd, HSR Layout Sector 3, Bengaluru, Karnataka 560102",
      logo: "", // Base64 Data URL
      currency: "₹",
      taxVal: 18,
      terms: "50% advance to procure raw materials.\n40% on stage completion of framework.\n10% post-handover.\nEstimate Validity: 15 days from issue date."
    },
    quotes: [], // Collection of saved estimate records
    currentQuoteId: null, // Holds ID when editing an existing quote
    isPremiumActive: false // Premium subscription status simulation
  };

  // Drawing signature pad flags
  let drawing = false;
  let canvas, ctx;
  let hasSignature = false;

  // ==========================================================================
  // B. Elements Cache
  // ==========================================================================
  
  // Sidebar Tabs
  const sideTabDashboard = document.getElementById("sideTabDashboard");
  const sideTabCreate = document.getElementById("sideTabCreate");
  const sideTabBusiness = document.getElementById("sideTabBusiness");
  const sideTabPremium = document.getElementById("sideTabPremium");
  
  const sidebarBizName = document.getElementById("sidebarBizName");
  const sidebarOwner = document.getElementById("sidebarOwner");
  const sidebarLogoImg = document.getElementById("sidebarLogoImg");
  const sidebarLogoContainer = document.getElementById("sidebarLogoContainer");
  const sidebarPremiumBadge = document.getElementById("sidebarPremiumBadge");

  // Core Section Views
  const viewDashboard = document.getElementById("viewDashboard");
  const viewCreateEstimate = document.getElementById("viewCreateEstimate");
  const viewBusiness = document.getElementById("viewBusiness");
  const viewPremium = document.getElementById("viewPremium");

  // Breadcrumbs Header
  const headerBreadcrumb = document.getElementById("headerBreadcrumb");
  const globalCreateQuoteBtn = document.getElementById("globalCreateQuoteBtn");

  // Dashboard Stats & Table
  const metricWon = document.getElementById("metricWon");
  const metricSent = document.getElementById("metricSent");
  const metricDraft = document.getElementById("metricDraft");
  const metricCount = document.getElementById("metricCount");
  const metricSuccessPill = document.getElementById("metricSuccessPill");
  
  const searchQuoteInput = document.getElementById("searchQuoteInput");
  const statusFilter = document.getElementById("statusFilter");
  const clearAllHistoryBtn = document.getElementById("clearAllHistoryBtn");
  const historyTableBody = document.getElementById("historyTableBody");
  const emptyStateView = document.getElementById("emptyStateView");

  // Estimate Form & Builder Details
  const btnFormBack = document.getElementById("btnFormBack");
  const estimateForm = document.getElementById("estimateForm");
  const clientName = document.getElementById("clientName");
  const clientPhone = document.getElementById("clientPhone");
  const clientEmail = document.getElementById("clientEmail");
  const clientAddress = document.getElementById("clientAddress");
  
  const tradePreset = document.getElementById("tradePreset");
  const itemsTableBody = document.getElementById("itemsTableBody");
  const addNewItemRowBtn = document.getElementById("addNewItemRowBtn");
  const quickPresetChipsContainer = document.getElementById("quickPresetChipsContainer");
  
  const toggleDiscount = document.getElementById("toggleDiscount");
  const inputDiscountVal = document.getElementById("inputDiscountVal");
  const labelSubtotal = document.getElementById("labelSubtotal");
  const discountValRow = document.getElementById("discountValRow");
  const labelDiscount = document.getElementById("labelDiscount");
  
  const toggleTax = document.getElementById("toggleTax");
  const inputTaxVal = document.getElementById("inputTaxVal");
  const taxValRow = document.getElementById("taxValRow");
  const labelTaxName = document.getElementById("labelTaxName");
  const labelTax = document.getElementById("labelTax");
  const labelGrandTotal = document.getElementById("labelGrandTotal");
  
  const paymentTerms = document.getElementById("paymentTerms");
  const pdfThemeSelect = document.getElementById("pdfThemeSelect");
  const estimateStatus = document.getElementById("estimateStatus");

  // Signature canvas
  const sigCanvas = document.getElementById("sigCanvas");
  const clearSigBtn = document.getElementById("clearSigBtn");
  const sigPlaceholder = document.getElementById("sigPlaceholder");

  // Right Sticky PDF preview
  const pdfPrintTarget = document.getElementById("pdfPrintTarget");

  // Bottom action buttons
  const btnSaveDraft = document.getElementById("btnSaveDraft");
  const btnDownloadPDF = document.getElementById("btnDownloadPDF");
  const btnShareWhatsApp = document.getElementById("btnShareWhatsApp");

  // Business profile Settings Fields
  const settingsForm = document.getElementById("settingsForm");
  const logoFileInput = document.getElementById("logoFileInput");
  const logoPreviewBox = document.getElementById("logoPreviewBox");
  const logoImg = document.getElementById("logoImg");
  const removeLogoBtn = document.getElementById("removeLogoBtn");
  
  const bizName = document.getElementById("bizName");
  const bizOwner = document.getElementById("bizOwner");
  const bizPhone = document.getElementById("bizPhone");
  const bizEmail = document.getElementById("bizEmail");
  const bizGST = document.getElementById("bizGST");
  const bizAddress = document.getElementById("bizAddress");
  
  const defaultCurrency = document.getElementById("defaultCurrency");
  const defaultTaxVal = document.getElementById("defaultTaxVal");
  const defaultTerms = document.getElementById("defaultTerms");

  // Premium Pricing View elements
  const billingPeriodToggle = document.getElementById("billingPeriodToggle");
  const pricingValue = document.getElementById("pricingValue");
  const pricingPeriod = document.getElementById("pricingPeriod");
  const activatePremiumBtn = document.getElementById("activatePremiumBtn");

  // Sandbox configurations
  const razorpayKey = document.getElementById("razorpayKey");
  const monetizationMode = document.getElementById("monetizationMode");

  // Toast container
  const toastContainer = document.getElementById("toastContainer");

  // ==========================================================================
  // C. Toast Alert Notifications
  // ==========================================================================
  function showToast(message, type = "info") {
    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;
    
    let iconClass = "fa-circle-info";
    if (type === "success") iconClass = "fa-circle-check";
    if (type === "error") iconClass = "fa-triangle-exclamation";
    
    toast.innerHTML = `<i class="fa-solid ${iconClass}"></i> <span>${message}</span>`;
    toastContainer.appendChild(toast);
    
    setTimeout(() => {
      toast.style.animation = "slideInToast 0.3s reverse forwards";
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  // ==========================================================================
  // D. Local Storage & Settings Synchronization
  // ==========================================================================
  function initDataStore() {
    const storedState = localStorage.getItem("quickestimate_state");
    if (storedState) {
      try {
        appState = JSON.parse(storedState);
      } catch (e) {
        console.error("Storage corrupt, resetting.", e);
      }
    }
    
    // Set default keys if missing
    if (!appState.settings) appState.settings = {};
    if (!appState.settings.bizName) {
      appState.settings = {
        bizName: "Royal Decorators & Painters",
        bizOwner: "Suresh Gowda",
        bizPhone: "9876543210",
        bizEmail: "contact@royaldecors.com",
        bizGST: "29AAAAA0000A1Z5",
        bizAddress: "1st Main Rd, HSR Layout Sector 3, Bengaluru, Karnataka 560102",
        logo: "",
        currency: "₹",
        taxVal: 18,
        terms: "50% advance to procure raw materials.\n40% on stage completion of framework.\n10% post-handover.\nEstimate Validity: 15 days from issue date."
      };
    }

    // Refresh UI Profile cards
    updateBizDetailsUI();
    syncSettingsToFormFields();
  }

  function saveDataStore() {
    localStorage.setItem("quickestimate_state", JSON.stringify(appState));
  }

  // Refresh Sidebar Avatar card
  function updateBizDetailsUI() {
    sidebarBizName.textContent = appState.settings.bizName || "My Business";
    sidebarOwner.textContent = appState.settings.bizOwner || "Owner";
    
    if (appState.settings.logo) {
      sidebarLogoImg.src = appState.settings.logo;
      sidebarLogoImg.classList.remove("hidden");
      sidebarLogoContainer.querySelector(".fa-building").classList.add("hidden");
    } else {
      sidebarLogoImg.src = "";
      sidebarLogoImg.classList.add("hidden");
      sidebarLogoContainer.querySelector(".fa-building").classList.remove("hidden");
    }

    // Pro indicators & Ad slot visibility toggles
    const sidebarAd = document.getElementById("sidebarAdSlot");
    const dashboardAd = document.getElementById("dashboardAdSlot");

    if (appState.isPremiumActive) {
      sidebarPremiumBadge.innerHTML = `<i class="fa-solid fa-crown" style="color: #f59e0b;"></i> Pro Account Active`;
      sidebarPremiumBadge.style.color = "#10b981";
      sideTabPremium.innerHTML = `<i class="fa-solid fa-crown"></i> <span>QuickEstimate Pro Active</span>`;
      
      if (sidebarAd) sidebarAd.classList.add("hide-ads");
      if (dashboardAd) dashboardAd.classList.add("hide-ads");
    } else {
      sidebarPremiumBadge.innerHTML = `<i class="fa-solid fa-shield-halved"></i> Free Account (Upgrade)`;
      sidebarPremiumBadge.style.color = "#f59e0b";
      sideTabPremium.innerHTML = `<i class="fa-solid fa-crown"></i> <span>Upgrade to Pro Plan</span>`;
      
      if (sidebarAd) sidebarAd.classList.remove("hide-ads");
      if (dashboardAd) dashboardAd.classList.remove("hide-ads");
    }
  }

  function syncSettingsToFormFields() {
    bizName.value = appState.settings.bizName || "";
    bizOwner.value = appState.settings.bizOwner || "";
    bizPhone.value = appState.settings.bizPhone || "";
    bizEmail.value = appState.settings.bizEmail || "";
    bizGST.value = appState.settings.bizGST || "";
    bizAddress.value = appState.settings.bizAddress || "";
    
    defaultCurrency.value = appState.settings.currency || "₹";
    defaultTaxVal.value = appState.settings.taxVal || 18;
    defaultTerms.value = appState.settings.terms || "";

    if (appState.settings.logo) {
      logoImg.src = appState.settings.logo;
      logoImg.classList.remove("hidden");
      logoPreviewBox.querySelector(".logo-placeholder-icon").classList.add("hidden");
      removeLogoBtn.classList.remove("hidden");
    } else {
      logoImg.src = "";
      logoImg.classList.add("hidden");
      logoPreviewBox.querySelector(".logo-placeholder-icon").classList.remove("hidden");
      removeLogoBtn.classList.add("hidden");
    }
  }

  // ==========================================================================
  // E. Sidebar Routing Engine
  // ==========================================================================
  function switchView(targetViewId) {
    const views = [viewDashboard, viewCreateEstimate, viewBusiness, viewPremium];
    views.forEach(v => {
      v.classList.remove("active-view");
      v.style.display = "none";
    });

    const target = document.getElementById(targetViewId);
    target.style.display = "block";
    setTimeout(() => target.classList.add("active-view"), 50);

    // Sync Sidebar Active Class
    const buttons = [sideTabDashboard, sideTabCreate, sideTabBusiness, sideTabPremium];
    buttons.forEach(b => b.classList.remove("active"));

    if (targetViewId === "viewDashboard") {
      sideTabDashboard.classList.add("active");
      headerBreadcrumb.textContent = "Dashboard / History";
      renderQuotesHistoryTable();
    } else if (targetViewId === "viewCreateEstimate") {
      sideTabCreate.classList.add("active");
      headerBreadcrumb.textContent = "Create Estimate Sheet";
    } else if (targetViewId === "viewBusiness") {
      sideTabBusiness.classList.add("active");
      headerBreadcrumb.textContent = "My Business Settings";
      syncSettingsToFormFields();
    } else if (targetViewId === "viewPremium") {
      sideTabPremium.classList.add("active");
      headerBreadcrumb.textContent = "Subscription Pro Plan";
    }
  }

  // Switch Click hooks
  sideTabDashboard.addEventListener("click", () => switchView("viewDashboard"));
  sideTabCreate.addEventListener("click", () => {
    resetEstimateForm();
    switchView("viewCreateEstimate");
  });
  sideTabBusiness.addEventListener("click", () => switchView("viewBusiness"));
  sideTabPremium.addEventListener("click", () => switchView("viewPremium"));
  
  btnFormBack.addEventListener("click", () => switchView("viewDashboard"));
  globalCreateQuoteBtn.addEventListener("click", () => {
    resetEstimateForm();
    switchView("viewCreateEstimate");
  });

  // ==========================================================================
  // F. Signature Canvas Drawing Controllers
  // ==========================================================================
  function initSignaturePad() {
    canvas = sigCanvas;
    ctx = canvas.getContext("2d");
    
    resizeSignatureCanvas();
    
    // Draw event triggers
    canvas.addEventListener("mousedown", startDrawing);
    canvas.addEventListener("mousemove", drawLine);
    canvas.addEventListener("mouseup", stopDrawing);
    canvas.addEventListener("mouseleave", stopDrawing);
    
    // Mobile Touch backup triggers
    canvas.addEventListener("touchstart", (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      const mouseEvent = new MouseEvent("mousedown", {
        clientX: touch.clientX, clientY: touch.clientY
      });
      canvas.dispatchEvent(mouseEvent);
    }, { passive: false });
    
    canvas.addEventListener("touchmove", (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      const mouseEvent = new MouseEvent("mousemove", {
        clientX: touch.clientX, clientY: touch.clientY
      });
      canvas.dispatchEvent(mouseEvent);
    }, { passive: false });
    
    canvas.addEventListener("touchend", (e) => {
      e.preventDefault();
      const mouseEvent = new MouseEvent("mouseup", {});
      canvas.dispatchEvent(mouseEvent);
    }, { passive: false });
  }

  function resizeSignatureCanvas() {
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
    
    ctx.strokeStyle = "#1e3a8a"; // premium blue signature ink
    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    
    hasSignature = false;
  }

  function startDrawing(e) {
    drawing = true;
    const pos = getCanvasCoords(e);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
    sigPlaceholder.classList.add("hidden");
  }

  function drawLine(e) {
    if (!drawing) return;
    const pos = getCanvasCoords(e);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    hasSignature = true;
    
    // Live update preview with signature
    triggerLivePreviewUpdate();
  }

  function stopDrawing() {
    drawing = false;
  }

  function getCanvasCoords(e) {
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  }

  function clearSignature() {
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    sigPlaceholder.classList.remove("hidden");
    hasSignature = false;
    triggerLivePreviewUpdate();
  }

  clearSigBtn.addEventListener("click", clearSignature);
  window.addEventListener("resize", resizeSignatureCanvas);

  // ==========================================================================
  // G. Interactive Form & Dynamic Line Rows calculations
  // ==========================================================================
  
  function addItemRow(desc = "", rate = "", qty = "", unit = "Sq.Ft") {
    const tbody = itemsTableBody;
    const rowCount = tbody.children.length;
    const rowId = `row-${Date.now()}-${rowCount}`;

    const tr = document.createElement("tr");
    tr.id = rowId;
    tr.className = "item-table-row";

    tr.innerHTML = `
      <td class="row-index" style="text-align: center; font-weight: 700; color: var(--text-muted);">${rowCount + 1}</td>
      <td>
        <input type="text" class="item-desc" required placeholder="Description of work or material specification" value="${desc}">
      </td>
      <td>
        <input type="number" class="item-rate" required placeholder="0.00" min="0" step="any" value="${rate}">
      </td>
      <td>
        <input type="number" class="item-qty" required placeholder="1" min="0" step="any" value="${qty}">
      </td>
      <td>
        <select class="item-unit">
          <option value="Sq.Ft" ${unit === "Sq.Ft" ? "selected" : ""}>Sq.Ft</option>
          <option value="Rft" ${unit === "Rft" ? "selected" : ""}>Rft</option>
          <option value="Nos" ${unit === "Nos" ? "selected" : ""}>Nos</option>
          <option value="Days" ${unit === "Days" ? "selected" : ""}>Days</option>
          <option value="Lumpsum" ${unit === "Lumpsum" ? "selected" : ""}>Lumpsum</option>
        </select>
      </td>
      <td class="row-total" style="text-align: right; font-weight: 700; color: var(--text-main);">₹0.00</td>
      <td style="text-align: center;">
        <button type="button" class="remove-row-btn" aria-label="Remove Row">
          <i class="fa-solid fa-trash-can"></i>
        </button>
      </td>
    `;

    tbody.appendChild(tr);

    // Event hooks
    const descInput = tr.querySelector(".item-desc");
    const rateInput = tr.querySelector(".item-rate");
    const qtyInput = tr.querySelector(".item-qty");
    const unitInput = tr.querySelector(".item-unit");
    const removeBtn = tr.querySelector(".remove-row-btn");

    descInput.addEventListener("input", triggerLivePreviewUpdate);
    rateInput.addEventListener("input", calculateFormTotals);
    qtyInput.addEventListener("input", calculateFormTotals);
    unitInput.addEventListener("change", triggerLivePreviewUpdate);

    removeBtn.addEventListener("click", () => {
      tr.remove();
      reindexTableRows();
      calculateFormTotals();
    });

    calculateFormTotals();
  }

  function reindexTableRows() {
    const rows = itemsTableBody.querySelectorAll(".item-table-row");
    rows.forEach((row, idx) => {
      row.querySelector(".row-index").textContent = idx + 1;
    });
  }

  function calculateFormTotals() {
    let subtotal = 0;
    const rows = itemsTableBody.querySelectorAll(".item-table-row");
    const currency = appState.settings.currency || "₹";

    rows.forEach(row => {
      const rate = parseFloat(row.querySelector(".item-rate").value) || 0;
      const qty = parseFloat(row.querySelector(".item-qty").value) || 0;
      const lineTotal = rate * qty;

      subtotal += lineTotal;
      row.querySelector(".row-total").textContent = `${currency}${lineTotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    });

    labelSubtotal.textContent = `${currency}${subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    // Discount calculations
    let discountAmount = 0;
    if (toggleDiscount.checked) {
      inputDiscountVal.disabled = false;
      const discountPct = parseFloat(inputDiscountVal.value) || 0;
      discountAmount = (subtotal * discountPct) / 100;
      discountValRow.classList.remove("hidden");
      labelDiscount.textContent = `-${currency}${discountAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    } else {
      inputDiscountVal.disabled = true;
      discountValRow.classList.add("hidden");
    }

    // Tax calculations
    const taxableSubtotal = subtotal - discountAmount;
    let taxAmount = 0;
    if (toggleTax.checked) {
      inputTaxVal.disabled = false;
      const taxPct = parseFloat(inputTaxVal.value) || 0;
      taxAmount = (taxableSubtotal * taxPct) / 100;
      taxValRow.classList.remove("hidden");
      labelTaxName.textContent = `GST (${taxPct}%):`;
      labelTax.textContent = `${currency}${taxAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    } else {
      inputTaxVal.disabled = true;
      taxValRow.classList.add("hidden");
    }

    // Grand totals calculation
    const grandTotal = taxableSubtotal + taxAmount;
    labelGrandTotal.textContent = `${currency}${grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    // Sync preview in real-time!
    triggerLivePreviewUpdate();
  }

  // Trigger bindings
  toggleDiscount.addEventListener("change", calculateFormTotals);
  inputDiscountVal.addEventListener("input", calculateFormTotals);
  toggleTax.addEventListener("change", calculateFormTotals);
  inputTaxVal.addEventListener("input", calculateFormTotals);
  addNewItemRowBtn.addEventListener("click", () => addItemRow());

  // Trade loading configurations
  tradePreset.addEventListener("change", (e) => {
    const tradeKey = e.target.value;
    if (!tradeKey || !TRADE_PRESETS[tradeKey]) return;

    itemsTableBody.innerHTML = "";
    
    const preset = TRADE_PRESETS[tradeKey];
    preset.items.forEach(it => addItemRow(it.desc, it.rate, it.qty, it.unit));
    
    renderPresetChips(preset.chips);
    showToast(`Loaded ${preset.name} standard presets!`, "success");
    calculateFormTotals();
  });

  function renderPresetChips(chips) {
    quickPresetChipsContainer.innerHTML = "";
    chips.forEach(chip => {
      const span = document.createElement("span");
      span.className = "preset-chip";
      span.innerHTML = `<i class="fa-solid fa-plus-circle"></i> ${chip}`;
      span.addEventListener("click", () => {
        let rate = 1500;
        let unit = "Sq.Ft";
        if (chip.includes("Painting") || chip.includes("Paint") || chip.includes("Coat")) { rate = 18; unit = "Sq.Ft"; }
        if (chip.includes("Wardrobe") || chip.includes("Cabinet")) { rate = 1450; unit = "Sq.Ft"; }
        if (chip.includes("Clog") || chip.includes("Mixer") || chip.includes("Switchboard")) { rate = 2200; unit = "Nos"; }
        if (chip.includes("Fee") || chip.includes("Render")) { rate = 15000; unit = "Lumpsum"; }

        addItemRow(chip, rate, 1, unit);
        showToast(`Added suggester row: "${chip}"`, "info");
      });
      quickPresetChipsContainer.appendChild(span);
    });
  }

  // ==========================================================================
  // H. Real-Time Instant live preview compile decorator
  // ==========================================================================
  
  function triggerLivePreviewUpdate() {
    const quote = compileEstimatePayload(true); // compile draft payload (ignore validators for preview)
    if (quote) {
      renderPDFTemplateHTML(quote);
    }
  }

  // Bind keyups to all client metadata fields so preview updates instantly!
  [clientName, clientPhone, clientEmail, clientAddress, paymentTerms].forEach(field => {
    field.addEventListener("input", triggerLivePreviewUpdate);
  });
  
  pdfThemeSelect.addEventListener("change", triggerLivePreviewUpdate);
  estimateStatus.addEventListener("change", triggerLivePreviewUpdate);

  // Bind dots theme switcher inside sticky panel
  document.querySelectorAll(".theme-dot").forEach(dot => {
    dot.addEventListener("click", (e) => {
      document.querySelectorAll(".theme-dot").forEach(d => d.classList.remove("active"));
      e.target.classList.add("active");

      const selectedTheme = e.target.getAttribute("data-theme");
      pdfPrintTarget.className = `pdf-print-target theme-${selectedTheme}`;
      
      pdfThemeSelect.value = selectedTheme;
      triggerLivePreviewUpdate();
    });
  });

  // ==========================================================================
  // I. Reset / Compile Draft States
  // ==========================================================================
  function resetEstimateForm(existingQuote = null) {
    estimateForm.reset();
    itemsTableBody.innerHTML = "";
    clearSignature();

    inputTaxVal.value = appState.settings.taxVal || 18;
    paymentTerms.value = appState.settings.terms || "";

    toggleDiscount.checked = false;
    inputDiscountVal.value = 0;
    inputDiscountVal.disabled = true;
    discountValRow.classList.add("hidden");

    toggleTax.checked = true;
    inputTaxVal.disabled = false;
    taxValRow.classList.remove("hidden");

    if (existingQuote) {
      appState.currentQuoteId = existingQuote.id;
      
      clientName.value = existingQuote.client.name;
      clientPhone.value = existingQuote.client.phone;
      clientEmail.value = existingQuote.client.email || "";
      clientAddress.value = existingQuote.client.address || "";

      existingQuote.items.forEach(it => addItemRow(it.desc, it.rate, it.qty, it.unit));

      if (existingQuote.discountPct > 0) {
        toggleDiscount.checked = true;
        inputDiscountVal.value = existingQuote.discountPct;
        inputDiscountVal.disabled = false;
      }

      if (existingQuote.taxPct > 0) {
        toggleTax.checked = true;
        inputTaxVal.value = existingQuote.taxPct;
        inputTaxVal.disabled = false;
      } else {
        toggleTax.checked = false;
        inputTaxVal.value = 0;
        inputTaxVal.disabled = true;
      }

      paymentTerms.value = existingQuote.terms;
      pdfThemeSelect.value = existingQuote.pdfTheme || "indigo";
      estimateStatus.value = existingQuote.status || "sent";

      // signature drawing load
      if (existingQuote.signature) {
        const img = new Image();
        img.onload = () => {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0);
          sigPlaceholder.classList.add("hidden");
          hasSignature = true;
          triggerLivePreviewUpdate();
        };
        img.src = existingQuote.signature;
      }
    } else {
      appState.currentQuoteId = null;
      tradePreset.value = "";
      pdfThemeSelect.value = "indigo";
      estimateStatus.value = "sent";

      addItemRow("", "", "", "Sq.Ft");
    }

    // Set dots active matching theme
    document.querySelectorAll(".theme-dot").forEach(d => {
      d.classList.remove("active");
      if (d.getAttribute("data-theme") === pdfThemeSelect.value) {
        d.classList.add("active");
      }
    });

    // Resize Signature Pad
    setTimeout(initSignaturePad, 150);
  }

  function compileEstimatePayload(isForPreviewOnly = false) {
    const nameVal = clientName.value.trim() || (isForPreviewOnly ? "Client Name" : "");
    const phoneVal = clientPhone.value.trim() || (isForPreviewOnly ? "9876543210" : "");
    
    if (!isForPreviewOnly && (!nameVal || !phoneVal)) {
      return null;
    }

    const items = [];
    const rows = itemsTableBody.querySelectorAll(".item-table-row");
    let hasInvalidItem = false;

    rows.forEach(row => {
      const desc = row.querySelector(".item-desc").value.trim() || (isForPreviewOnly ? "Description of item" : "");
      const rate = parseFloat(row.querySelector(".item-rate").value) || 0;
      const qty = parseFloat(row.querySelector(".item-qty").value) || 0;
      const unit = row.querySelector(".item-unit").value;

      if (!desc || rate < 0 || qty < 0) {
        hasInvalidItem = true;
      }

      items.push({ desc, rate, qty, unit });
    });

    if (!isForPreviewOnly && (rows.length === 0 || hasInvalidItem)) {
      return null;
    }

    let sigBase64 = "";
    if (hasSignature) {
      sigBase64 = canvas.toDataURL();
    }

    // Math sum
    let subtotal = 0;
    items.forEach(it => subtotal += (it.rate * it.qty));

    const discPct = toggleDiscount.checked ? (parseFloat(inputDiscountVal.value) || 0) : 0;
    const discountAmt = (subtotal * discPct) / 100;

    const taxPct = toggleTax.checked ? (parseFloat(inputTaxVal.value) || 0) : 0;
    const taxAmt = ((subtotal - discountAmt) * taxPct) / 100;

    const grandTotalVal = (subtotal - discountAmt) + taxAmt;

    const compiled = {
      id: appState.currentQuoteId || `quote-${Date.now()}`,
      client: {
        name: nameVal,
        phone: phoneVal,
        email: clientEmail.value.trim(),
        address: clientAddress.value.trim()
      },
      trade: tradePreset.value || "custom",
      items: items,
      subtotal: subtotal,
      discountPct: discPct,
      discountVal: discountAmt,
      taxPct: taxPct,
      taxVal: taxAmt,
      grandTotal: grandTotalVal,
      terms: paymentTerms.value.trim(),
      pdfTheme: pdfThemeSelect.value,
      status: estimateStatus.value,
      signature: sigBase64,
      dateString: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
    };

    return compiled;
  }

  // ==========================================================================
  // J. Save Draft / Print operations
  // ==========================================================================
  
  btnSaveDraft.addEventListener("click", () => {
    const payload = compileEstimatePayload();
    if (!payload) {
      showToast("Please fill client Name and WhatsApp phone number before saving.", "error");
      return;
    }

    const idx = appState.quotes.findIndex(q => q.id === payload.id);
    if (idx >= 0) {
      appState.quotes[idx] = payload;
    } else {
      appState.quotes.unshift(payload);
    }

    saveDataStore();
    showToast("Estimate quotation draft saved locally!", "success");
    switchView("viewDashboard");
  });

  btnDownloadPDF.addEventListener("click", () => {
    const payload = compileEstimatePayload();
    if (!payload) {
      showToast("Please fill client details and insert valid items before printing.", "error");
      return;
    }

    // Auto save draft first
    const idx = appState.quotes.findIndex(q => q.id === payload.id);
    if (idx >= 0) {
      appState.quotes[idx] = payload;
    } else {
      appState.quotes.unshift(payload);
    }
    saveDataStore();

    triggerPDFDownload(payload);
  });

  btnShareWhatsApp.addEventListener("click", () => {
    const payload = compileEstimatePayload();
    if (!payload) {
      showToast("Please complete form details before sharing.", "error");
      return;
    }
    triggerWhatsAppShare(payload);
  });

  // ==========================================================================
  // K. HTML template PDF builder
  // ==========================================================================
  function renderPDFTemplateHTML(quote) {
    const biz = appState.settings;
    const currency = biz.currency || "₹";
    const selectedTheme = quote.pdfTheme || "indigo";

    pdfPrintTarget.className = `pdf-print-target theme-${selectedTheme}`;

    // Rows
    let rowsHTML = "";
    quote.items.forEach((it, idx) => {
      const lineTot = it.rate * it.qty;
      rowsHTML += `
        <tr>
          <td>${idx + 1}</td>
          <td><strong>${it.desc}</strong></td>
          <td class="text-right">${currency}${it.rate.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
          <td style="text-align: center;">${it.qty} ${it.unit}</td>
          <td class="text-right"><strong>${currency}${lineTot.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</strong></td>
        </tr>
      `;
    });

    // Logo
    let logoHTML = "";
    if (biz.logo) {
      logoHTML = `
        <div class="pdf-logo-wrapper">
          <img src="${biz.logo}" alt="Company Logo">
        </div>
        <div class="pdf-meta-item"><strong>${biz.bizName}</strong></div>
      `;
    } else {
      logoHTML = `
        <div class="pdf-fallback-logo">
          <strong>${biz.bizName.split(' ')[0]}</strong><span>${biz.bizName.split(' ').slice(1).join(' ') || ''}</span>
        </div>
      `;
    }

    const taxIDHTML = biz.bizGST ? `<div class="pdf-meta-item">GSTIN: <strong>${biz.bizGST}</strong></div>` : "";
    const clientEmailHTML = quote.client.email ? `<div>Email: ${quote.client.email}</div>` : "";
    const clientAddrHTML = quote.client.address ? `<div>Location: ${quote.client.address}</div>` : "";

    // Signature
    let sigHTML = "";
    if (quote.signature) {
      sigHTML = `<img src="${quote.signature}" alt="Authorized Signature">`;
    } else {
      sigHTML = `<span style="font-family: 'Outfit', sans-serif; font-size: 0.9rem; color: #cbd5e1; font-style: italic;">Digitally Signed</span>`;
    }

    const discountRowHTML = quote.discountPct > 0 ? `
      <div class="pdf-math-row" style="color: #ef4444;">
        <span>Discount (${quote.discountPct}%):</span>
        <span>-${currency}${quote.discountVal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
      </div>
    ` : "";

    const taxRowHTML = quote.taxPct > 0 ? `
      <div class="pdf-math-row">
        <span>GST/Tax (${quote.taxPct}%):</span>
        <span>+${currency}${quote.taxVal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
      </div>
    ` : "";

    // Assemble PDF
    pdfPrintTarget.innerHTML = `
      <div class="pdf-header">
        <div class="pdf-brand-block">
          ${logoHTML}
          <div class="pdf-meta-item" style="margin-top: 6px;">Phone: <strong>+91 ${biz.bizPhone}</strong></div>
          <div class="pdf-meta-item">Email: <strong>${biz.bizEmail || ''}</strong></div>
          ${taxIDHTML}
        </div>
        <div class="pdf-title-block">
          <h2>QUOTATION</h2>
          <div class="pdf-meta-item">Quote ID: <strong>${quote.id.replace('quote-', 'QE-').toUpperCase()}</strong></div>
          <div class="pdf-meta-item">Date: <strong>${quote.dateString}</strong></div>
          <div class="pdf-meta-item">Status: <strong>${quote.status.toUpperCase()}</strong></div>
        </div>
      </div>

      <div class="pdf-addresses-grid">
        <div>
          <div class="pdf-adr-title">Contractor details</div>
          <div class="pdf-adr-content">
            <h4>${biz.bizOwner || biz.bizName}</h4>
            <p>${biz.bizAddress || ''}</p>
          </div>
        </div>
        <div>
          <div class="pdf-adr-title">Quotation Prepared For</div>
          <div class="pdf-adr-content">
            <h4>${quote.client.name}</h4>
            <div>Phone: +91 ${quote.client.phone}</div>
            ${clientEmailHTML}
            ${clientAddrHTML}
          </div>
        </div>
      </div>

      <table class="pdf-items-table">
        <thead>
          <tr>
            <th width="8%">#</th>
            <th width="52%">Description of Work / Activity</th>
            <th width="15%" class="text-right">Rate</th>
            <th width="10%" style="text-align: center;">Qty</th>
            <th width="15%" class="text-right">Total</th>
          </tr>
        </thead>
        <tbody>
          ${rowsHTML}
        </tbody>
      </table>

      <div class="pdf-summary-grid">
        <div class="pdf-terms-block">
          <h4>Payment & Terms of Agreement</h4>
          <p>${quote.terms || '50% advance to initiate procurement, remaining balance due on handover.'}</p>
        </div>
        <div class="pdf-math-block">
          <div class="pdf-math-row">
            <span>Subtotal:</span>
            <span>${currency}${quote.subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
          </div>
          ${discountRowHTML}
          ${taxRowHTML}
          <div class="pdf-math-row pdf-grand-row">
            <span>GRAND TOTAL:</span>
            <span>${currency}${quote.grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
          </div>
        </div>
      </div>

      <div class="pdf-sig-wrapper">
        <div class="pdf-sig-line">
          ${sigHTML}
        </div>
        <strong>Authorized Signatory</strong>
        <span style="color: #64748b; font-size: 0.6rem;">${biz.bizName}</span>
      </div>

      <div class="pdf-footer" style="margin-top: 24px;">
        Generated in 60 seconds with QuickEstimate. Closing high-value contracts on the go!
      </div>
    `;
  }

  function triggerPDFDownload(quote) {
    const opt = {
      margin:       0.3,
      filename:     `Quotation_${quote.client.name.replace(/\s+/g, '_')}_${quote.dateString.replace(/\s+/g, '')}.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true },
      jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    showToast("Compiling pixel-perfect print layout. Downloading...", "info");

    html2pdf().from(pdfPrintTarget).set(opt).save()
      .then(() => {
        showToast("PDF document downloaded successfully!", "success");
        if (typeof confetti === "function") {
          confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
        }
      })
      .catch(err => {
        console.error("PDF Fail: ", err);
        showToast("PDF generation failed. Try updating layout presets.", "error");
      });
  }

  function triggerWhatsAppShare(quote) {
    const biz = appState.settings;
    const currency = biz.currency || "₹";
    const grandFormatted = quote.grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 });

    const messageText = 
`Hello *${quote.client.name}*! 👋

Thank you for discussing your project with us today! We're excited about the opportunity to partner with you. 

Here is the quick quotation details summary:
🔸 *Business*: ${biz.bizName}
🔸 *Scope*: ${quote.trade.charAt(0).toUpperCase() + quote.trade.slice(1)} Contractor Works
🔸 *Total Amount*: ${currency}${grandFormatted} (incl. of taxes)
🔸 *Payment Terms*: ${quote.terms.split('\n')[0] || 'Standard Agreement'}

We have generated and signed a gorgeous, professional PDF quotation copy for your records. Click the link to view/approve on the chat!

Please let us know your availability to initiate the procurement and schedule the site layout this week!

Warm Regards,
*${biz.bizOwner || biz.bizName}*
📞 Phone: +91 ${biz.bizPhone}`;

    const encodedText = encodeURIComponent(messageText);
    const whatsappUrl = `https://wa.me/91${quote.client.phone}?text=${encodedText}`;

    window.open(whatsappUrl, "_blank");
    showToast("WhatsApp launched in new tab!", "success");
  }

  // ==========================================================================
  // L. Dashboard Table Render Hooks & Analytics Metrics
  // ==========================================================================
  function renderQuotesHistoryTable() {
    const filterVal = statusFilter.value;
    const searchVal = searchQuoteInput.value.toLowerCase().trim();
    const currency = appState.settings.currency || "₹";

    let filtered = appState.quotes;

    if (filterVal !== "all") {
      filtered = filtered.filter(q => q.status === filterVal);
    }

    if (searchVal) {
      filtered = filtered.filter(q => 
        q.client.name.toLowerCase().includes(searchVal) || 
        q.trade.toLowerCase().includes(searchVal) ||
        (q.client.address && q.client.address.toLowerCase().includes(searchVal))
      );
    }

    // Sort recent first
    filtered.sort((a,b) => b.id.localeCompare(a.id));

    historyTableBody.innerHTML = "";

    if (filtered.length === 0) {
      emptyStateView.classList.remove("hidden");
      updateAnalyticsMetrics();
      return;
    }

    emptyStateView.classList.add("hidden");

    filtered.forEach(quote => {
      const tr = document.createElement("tr");
      
      let statusClass = "badge-draft";
      if (quote.status === "sent") statusClass = "badge-sent";
      if (quote.status === "accepted") statusClass = "badge-accepted";
      if (quote.status === "declined") statusClass = "badge-declined";

      const grandFormatted = quote.grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 });
      const tradeName = TRADE_PRESETS[quote.trade]?.name || "💼 General Works";

      tr.innerHTML = `
        <td><strong>${quote.id.replace('quote-', 'QE-').toUpperCase()}</strong></td>
        <td><strong>${quote.client.name}</strong><br><span style="color: var(--text-muted); font-size: 0.7rem;">+91 ${quote.client.phone}</span></td>
        <td>${tradeName}</td>
        <td><i class="fa-regular fa-calendar" style="margin-right: 4px;"></i> ${quote.dateString}</td>
        <td style="text-align: right; font-weight: 700; color: var(--primary);">${currency}${grandFormatted}</td>
        <td style="text-align: center;"><span class="badge ${statusClass}">${quote.status}</span></td>
        <td>
          <div class="row-actions-group">
            <button class="btn-card-action action-share" title="Share WhatsApp"><i class="fa-brands fa-whatsapp"></i></button>
            <button class="btn-card-action action-pdf" title="Download PDF"><i class="fa-solid fa-file-pdf"></i></button>
            <button class="btn-card-action action-edit" title="Edit"><i class="fa-solid fa-pen-to-square"></i></button>
            <button class="btn-card-action action-delete" title="Delete"><i class="fa-solid fa-trash"></i></button>
          </div>
        </td>
      `;

      // actions
      tr.querySelector(".action-share").addEventListener("click", () => triggerWhatsAppShare(quote));
      tr.querySelector(".action-pdf").addEventListener("click", () => {
        renderPDFTemplateHTML(quote);
        triggerPDFDownload(quote);
      });
      tr.querySelector(".action-edit").addEventListener("click", () => {
        resetEstimateForm(quote);
        switchView("viewCreateEstimate");
      });
      tr.querySelector(".action-delete").addEventListener("click", () => {
        if (confirm(`Are you sure you want to delete quotation for ${quote.client.name}?`)) {
          deleteQuote(quote.id);
        }
      });

      historyTableBody.appendChild(tr);
    });

    updateAnalyticsMetrics();
  }

  function deleteQuote(id) {
    appState.quotes = appState.quotes.filter(q => q.id !== id);
    saveDataStore();
    showToast("Quotation wiped successfully.", "info");
    renderQuotesHistoryTable();
  }

  function updateAnalyticsMetrics() {
    const currency = appState.settings.currency || "₹";

    let totalWon = 0;
    let totalSent = 0;
    let totalDraft = 0;
    let totalQuotes = appState.quotes.length;
    let wonCount = 0;

    appState.quotes.forEach(q => {
      if (q.status === "accepted") {
        totalWon += q.grandTotal;
        wonCount++;
      } else if (q.status === "sent") {
        totalSent += q.grandTotal;
      } else if (q.status === "draft") {
        totalDraft += q.grandTotal;
      }
    });

    metricWon.textContent = `${currency}${totalWon.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
    metricSent.textContent = `${currency}${totalSent.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
    metricDraft.textContent = `${currency}${totalDraft.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
    
    // Win Ratio
    const winRatio = totalQuotes > 0 ? Math.round((wonCount / totalQuotes) * 100) : 0;
    metricCount.textContent = `${wonCount} / ${totalQuotes}`;
    metricSuccessPill.textContent = `${winRatio}% Conversion Rate`;
  }

  searchQuoteInput.addEventListener("input", renderQuotesHistoryTable);
  statusFilter.addEventListener("change", renderQuotesHistoryTable);

  clearAllHistoryBtn.addEventListener("click", () => {
    if (confirm("WARNING: Are you sure you want to wipe all quotation database logs? This is irreversible.")) {
      appState.quotes = [];
      saveDataStore();
      showToast("Historical data wiped.", "info");
      renderQuotesHistoryTable();
    }
  });

  document.querySelector(".create-first-btn").addEventListener("click", () => {
    resetEstimateForm();
    switchView("viewCreateEstimate");
  });

  // ==========================================================================
  // M. Settings Panel & Logo conversions
  // ==========================================================================
  
  settingsForm.addEventListener("submit", (e) => {
    e.preventDefault();

    appState.settings.bizName = bizName.value.trim();
    appState.settings.bizOwner = bizOwner.value.trim();
    appState.settings.bizPhone = bizPhone.value.trim();
    appState.settings.bizEmail = bizEmail.value.trim();
    appState.settings.bizGST = bizGST.value.trim();
    appState.settings.bizAddress = bizAddress.value.trim();

    appState.settings.currency = defaultCurrency.value;
    appState.settings.taxVal = parseFloat(defaultTaxVal.value) || 0;
    appState.settings.terms = defaultTerms.value;

    saveDataStore();
    updateBizDetailsUI();
    showToast("Business profile defaults updated successfully!", "success");
    switchView("viewDashboard");
  });

  logoFileInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 1572864) {
      showToast("Logo image size should be less than 1.5MB for storage limits.", "error");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64String = event.target.result;
      appState.settings.logo = base64String;

      logoImg.src = base64String;
      logoImg.classList.remove("hidden");
      logoPreviewBox.querySelector(".logo-placeholder-icon").classList.add("hidden");
      removeLogoBtn.classList.remove("hidden");
      
      saveDataStore();
      updateBizDetailsUI();
      showToast("Logo saved successfully!", "success");
    };
    reader.readAsDataURL(file);
  });

  removeLogoBtn.addEventListener("click", () => {
    appState.settings.logo = "";
    logoImg.src = "";
    logoImg.classList.add("hidden");
    logoPreviewBox.querySelector(".logo-placeholder-icon").classList.remove("hidden");
    removeLogoBtn.classList.add("hidden");
    logoFileInput.value = "";
    
    saveDataStore();
    updateBizDetailsUI();
    showToast("Business Logo removed.", "info");
  });

  // ==========================================================================
  // N. Premium Upgrade Subscription mechanics
  // ==========================================================================
  billingPeriodToggle.addEventListener("change", (e) => {
    if (e.target.checked) {
      // Yearly
      pricingValue.textContent = "1999";
      pricingPeriod.textContent = " / year";
      document.getElementById("billingYearlyLabel").className = "active-billing";
      document.getElementById("billingMonthlyLabel").className = "";
    } else {
      // Monthly
      pricingValue.textContent = "299";
      pricingPeriod.textContent = " / month";
      document.getElementById("billingMonthlyLabel").className = "active-billing";
      document.getElementById("billingYearlyLabel").className = "";
    }
  });

  activatePremiumBtn.addEventListener("click", () => {
    const isYearly = billingPeriodToggle.checked;
    const mode = monetizationMode.value;

    showToast("Processing payment gateway checkout...", "info");

    if (mode === "live") {
      showToast("Opening live production Razorpay portal...", "success");
      setTimeout(simulateProActivation, 1500);
    } else {
      setTimeout(simulateProActivation, 1200);
    }
  });

  function simulateProActivation() {
    appState.isPremiumActive = true;
    saveDataStore();

    updateBizDetailsUI();
    showToast("CONGRATULATIONS! Contractor Pro Plan Activated Successfully!", "success");

    if (typeof confetti === "function") {
      const end = Date.now() + (3.5 * 1000);
      const colors = ['#f59e0b', '#d97706', '#10b981'];

      (function frame() {
        confetti({ particleCount: 3, angle: 60, spread: 55, origin: { x: 0 }, colors: colors });
        confetti({ particleCount: 3, angle: 120, spread: 55, origin: { x: 1 }, colors: colors });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      }());
    }

    switchView("viewDashboard");
  }

  // ==========================================================================
  // O. Initialization Boostrapper
  // ==========================================================================
  initDataStore();
  
  // Direct default starting view
  switchView("viewDashboard");
});
