/**
 * HUSEN ONLINE MARKETING — Main Application Logic
 * Telegram Mini App Native Styling, 2-Step Checkout, Chapa Payment, SMS Integration
 * Header Language Dropdown & Full Admin Product CRUD System
 */

(function () {
  'use strict';

  // ==========================================================================
  // 1. TELEGRAM WEBAPP SDK INITIALIZATION
  // ==========================================================================
  if (window.Telegram && window.Telegram.WebApp) {
    try {
      window.Telegram.WebApp.ready();
      window.Telegram.WebApp.expand();
      console.log('[Telegram WebApp] Ready & Expanded');
    } catch (e) {
      console.warn('[Telegram WebApp] Init notice:', e);
    }
  }

  // ==========================================================================
  // 2. LOCALIZATION DICTIONARY (Amharic, Afaan Oromoo, English)
  // ==========================================================================
  const I18N = {
    am: {
      categories: {
        all: "ሁሉንም",
        kitchen: "ማብሰያ & ኩሽና",
        home: "የቤት ዕቃዎች",
        beauty: "ውበት",
        health: "ጤና"
      },
      heroBadge: "አዳማ ፈጣን የቤት ማድረስ",
      heroHeadline: "ጥራት ያላቸው የቤት እና የውበት ዕቃዎች",
      heroSubtext: "ለአዳማ ከተማ ፈጣን ማድረስ በቴሌብር፣ በኢትዮጵያ ንግድ ባንክ (Chapa) እና በእጅ ሲደርስ ክፍያ።",
      statDelivery: "በአዳማ በዕለቱ ማድረስ",
      statQuality: "100% አስተማማኝ ጥራት",
      statTelebirr: "Chapa (ቴሌብር እና ንግድ ባንክ)",
      catalogTitle: "ተወዳጅ ምርቶች",
      catalogSubtitle: "ዝርዝር ለማየት ወይም ወዲያውኑ ለማዘዝ ይጫኑ",
      itemsCount: "ዕቃዎች",
      inStock: "ክምችት ላይ አለ",
      outOfStock: "አልቋል",
      buyNow: "አሁኑኑ ይግዙ",
      addToCart: "ወደ ጋሪ ጨምር",
      addedToCartToast: "ወደ ጋሪ ተጨምሯል!",
      cartTitle: "የእርስዎ የገበያ ጋሪ",
      cartEmpty: "የእርስዎ ጋሪ ባዶ ነው",
      cartEmptySub: "ዕቃዎችን ይምረጡና እዚህ ያክሉ",
      cartAdamaBanner: "በአዳማ ከተማ ውስጥ ነፃ እና ፈጣን ማድረስ",
      subtotal: "የዕቃዎች ድምር",
      adamaDelivery: "የአዳማ ከተማ ማድረሻ",
      freeDelivery: "ነፃ",
      grandTotal: "ጠቅላላ ድምር",
      proceedCheckout: "ትዕዛዝ ማጠናቀቂያ",
      step1Pill: "1. የደንበኛ መረጃ",
      step2Pill: "2. የክፍያ ዘዴ",
      checkoutTitle: "የትዕዛዝ መረጃ",
      checkoutSubtitle: "ፈጣን ማድረሻ በአዳማ ከተማ",
      orderItems: "የታዘዙ ዕቃዎች",
      fullName: "ሙሉ ስም *",
      phone: "ስልክ ቁጥር *",
      phoneHelper: "ዕቃውን ለማድረስና ለክፍያ ማረጋገጫ ይጠቅማል",
      landmarkLabel: "የማድረሻ ቦታ / መለያ ቦታ በአዳማ *",
      landmarkPlaceholder: "ምሳሌ፡ ፖስታ ቤት፣ አዳማ",
      addressLabel: "ዝርዝር አድራሻ ወይም የቤት/ፎቅ ቁጥር",
      addressPlaceholder: "ምሳሌ፡ የቤት ቁጥር 204፣ 2ኛ ፎቅ",
      continueToPayment: "ወደ ክፍያ ይቀጥሉ",
      choosePaymentLabel: "የክፍያ ዘዴ ይምረጡ፡",
      chapaName: "ዲጂታል ክፍያ (ቴሌብር / ንግድ ባንክ)",
      chapaDesc: "በቴሌብር (Telebirr) ወይም በኢትዮጵያ ንግድ ባንክ (CBE) በ Chapa በኩል በቀጥታ ይክፈሉ።",
      codName: "በእጅ ሲደርስ (Cash on Delivery)",
      codDesc: "ዕቃው በአዳማ አድራሻዎ ሲደርስ ለአድራሹ ጥሬ ገንዘብ መክፈል",
      btnFinalizeChapa: "በ Chapa ይክፈሉ",
      btnFinalizeCod: "ትዕዛዙን አረጋግጥ (በእጅ ሲደርስ)",
      orderSuccessTitle: "ትዕዛዝዎ ተረጋግጧል!",
      orderSuccessSub: "ከሁሴን ኦንላይን ማርኬቲንግ ስለሸመቱ እናመሰግናለን",
      orderRef: "የትዕዛዝ መለያ ቁጥር:",
      smsNoticeTitle: "የኤስኤምኤስ (SMS) መልዕክት ለሱቁ ተልኳል",
      smsNoticeBody: "የትዕዛዝዎ ዝርዝር ለሱቁ አስተዳዳሪ (<strong>0923245529</strong>) በ AfroMessage SMS ተልኳል።",
      customer: "ደንበኛ:",
      phoneLabel: "ስልክ:",
      locationLabel: "የማድረሻ ቦታ:",
      paymentLabel: "የክፍያ ሁኔታ:",
      amountLabel: "ጠቅላላ ክፍያ:",
      callShopBtn: "ለሱቁ ይደውሉ (0923245529)",
      continueShoppingBtn: "ወደ ሱቅ ተመለስ",
      trustDeliveryTitle: "ፈጣን የሰፈር ማድረስ",
      trustDeliveryDesc: "ገንዳ ሃራ፣ ሥላሴ፣ አጣናተራ፣ ፒኮክ፣ ቦሌ፣ ማትዋሚስፕ እና ሌሎች የአዳማ አካባቢዎች።",
      trustSecureTitle: "አስተማማኝ የክፍያ አማራጮች",
      trustSecureDesc: "በ Chapa (ቴሌብር፣ ንግድ ባንክ) ወይም ዕቃው በእጅዎ ሲደርስ ይክፈሉ።",
      trustContactTitle: "ጥያቄ ወይም እገዛ ይፈልጋሉ?",
      selectQty: "ብዛት ይምረጡ",
      totalAmountLabel: "ጠቅላላ ክፍያ:"
    },

    om: {
      categories: {
        all: "Hunda",
        kitchen: "Kushiinaa",
        home: "Meeshaa Manaa",
        beauty: "Bareedina",
        health: "Fayyaa"
      },
      heroBadge: "Adaamaa Dhaqqabsiisa Saffisaa",
      heroHeadline: "Meeshaalee Manaa fi Bareedina Qulqullina Qaban",
      heroSubtext: "Kutaalee Adaamaa hundaaf dhiyeessii saffisaa Telebirr, CBE (Chapa) fi kaffaltii harkaan.",
      statDelivery: "Guyyuma Sana Adaamaatti",
      statQuality: "100% Mirkanaa'aa",
      statTelebirr: "Chapa (Telebirr & CBE)",
      catalogTitle: "Meeshaalee Filataman",
      catalogSubtitle: "Bal'ina ilaaluuf yookiin hatattamaan ajajuuf tuqaa",
      itemsCount: "Meeshaalee",
      inStock: "Gurgurtaaf Jira",
      outOfStock: "Dhumateera",
      buyNow: "Amma Biti",
      addToCart: "Gaaritti Dabali",
      addedToCartToast: "Gaaritti dabalameera!",
      cartTitle: "Gaarii Bittaa Keessan",
      cartEmpty: "Gaariin keessan duwwaadha",
      cartEmptySub: "Meeshaalee filadhaatii asitti dabalaa",
      cartAdamaBanner: "Magaalaa Adaamaa keessatti bilisaan qe'eetti dhaqqaba",
      subtotal: "Dimshaasha Meeshaalee",
      adamaDelivery: "Geessituu Adaamaa",
      freeDelivery: "BILISA",
      grandTotal: "Ida'ama Waliigalaa",
      proceedCheckout: "Ajaja Xumuri",
      step1Pill: "1. Odeeffannoo Maamilaa",
      step2Pill: "2. Mala Kaffaltii",
      checkoutTitle: "Odeeffannoo Bittaa",
      checkoutSubtitle: "Magaalaa Adaamaa keessatti saffisaan dhiyaata",
      orderItems: "Meeshaalee Ajajaman",
      fullName: "Maqaa Guutuu *",
      phone: "Lakkoofsa Bilbilaa *",
      phoneHelper: "Geessituuf fi kaffaltii mirkaneessuuf fayyada",
      landmarkLabel: "Iddoo Geessituu / Mallattoo Adaamaatti *",
      landmarkPlaceholder: "fk., Posta Bet, Adaamaa",
      addressLabel: "Teessoo Dabalataa ykn Lakkoofsa Manaa",
      addressPlaceholder: "fk., Mana Lakk. 204, Fooqii 2ffaa",
      continueToPayment: "Gara Kaffaltiitti Itti Fufi",
      choosePaymentLabel: "Mala Kaffaltii Filadhaa:",
      chapaName: "Kaffaltii Dijitaalaa (Telebirr / CBE)",
      chapaDesc: "Karaa Chapa Telebirr ykn Baankii Daldala Itoophiyaan battalatti kaffalaa.",
      codName: "Yeroo Si Dhaqqabu (Cash on Delivery)",
      codDesc: "Yeroo meeshaan Adaamaatti qe'ee keessan ga'u qarshii harkatti kaffalaa",
      btnFinalizeChapa: "Karaa Chapa Kaffali",
      btnFinalizeCod: "Ajaja Mirkaneessi (Harkatti)",
      orderSuccessTitle: "Ajajni Keessan Mirkanaa'eera!",
      orderSuccessSub: "Husen Online Marketing wajjin waan bittaniif galatoomaa",
      orderRef: "Koodii Ajajaa:",
      smsNoticeTitle: "Ergaan Gabaabaan (SMS) Dukaanaaf Ergameera",
      smsNoticeBody: "Odeeffannoon ajaja keessanii abbaa dukaanaaf (<strong>0923245529</strong>) karaa AfroMessage SMS ergameera.",
      customer: "Maamila:",
      phoneLabel: "Bilbila:",
      locationLabel: "Iddoo Geessituu:",
      paymentLabel: "Haala Kaffaltii:",
      amountLabel: "Kaffaltii Waliigalaa:",
      callShopBtn: "Dukaanaaf Bilbilaa (0923245529)",
      continueShoppingBtn: "Gara Dukaanaatti Deebi'i",
      trustDeliveryTitle: "Dhaqqabsiisa Naannoo Saffisaa",
      trustDeliveryDesc: "Ganda Haaraa, Sillaasee, Xannaatara, Piikook, Boolee, Matwaamispii fi Adaamaa.",
      trustSecureTitle: "Filannoowwan Kaffaltii Nageenya Qaban",
      trustSecureDesc: "Chapa (Telebirr, CBE) ykn yeroo si dhaqqabu harkatti kaffalaa.",
      trustContactTitle: "Gargaarsa Barbaadduu?",
      selectQty: "Baay'ina Filadhaa",
      totalAmountLabel: "Kaffaltii Waliigalaa:"
    },

    en: {
      categories: {
        all: "All",
        kitchen: "Kitchen",
        home: "Home",
        beauty: "Beauty",
        health: "Health"
      },
      heroBadge: "Adama Fast Local Delivery",
      heroHeadline: "Household & Lifestyle Essentials",
      heroSubtext: "Doorstep delivery across all neighborhoods in Adama with Telebirr / CBE via Chapa and Cash on Delivery.",
      statDelivery: "Same Day in Adama",
      statQuality: "100% Guaranteed",
      statTelebirr: "Chapa (Telebirr & CBE)",
      catalogTitle: "Featured Products",
      catalogSubtitle: "Tap any item to open Telegram Mini App view or order instantly",
      itemsCount: "Items",
      inStock: "In Stock",
      outOfStock: "Out of Stock",
      buyNow: "Buy Now",
      addToCart: "Add to Cart",
      addedToCartToast: "Added to your cart!",
      cartTitle: "Your Shopping Cart",
      cartEmpty: "Your cart is empty",
      cartEmptySub: "Browse products and add them here",
      cartAdamaBanner: "Free & fast doorstep delivery within Adama City",
      subtotal: "Subtotal",
      adamaDelivery: "Adama Local Delivery",
      freeDelivery: "FREE",
      grandTotal: "Grand Total",
      proceedCheckout: "Proceed to Checkout",
      step1Pill: "1. Customer Info",
      step2Pill: "2. Payment Method",
      checkoutTitle: "Customer Details",
      checkoutSubtitle: "Fast local delivery in Adama",
      orderItems: "Order Items",
      fullName: "Full Name *",
      phone: "Phone Number *",
      phoneHelper: "Required for courier dispatch and payment confirmation",
      landmarkLabel: "Delivery Location / Landmark in Adama *",
      landmarkPlaceholder: "e.g., Posta Bet, Adama",
      addressLabel: "Specific Address or House / Floor No.",
      addressPlaceholder: "e.g., House No. 204, 2nd Floor, next to Bank",
      continueToPayment: "Continue to Payment",
      choosePaymentLabel: "Select Payment Option:",
      chapaName: "Digital Payment (Telebirr / CBE via Chapa)",
      chapaDesc: "Instant online payment via Telebirr or Commercial Bank of Ethiopia (CBE) powered by Chapa gateway.",
      codName: "Cash on Delivery",
      codDesc: "Pay cash directly to our delivery rider when your package arrives in Adama.",
      btnFinalizeChapa: "Pay via Chapa",
      btnFinalizeCod: "Confirm Cash on Delivery",
      orderSuccessTitle: "Order Confirmed!",
      orderSuccessSub: "Thank you for shopping with Husen Online Marketing",
      orderRef: "Order Reference:",
      smsNoticeTitle: "Automated SMS Dispatched to Shop Owner",
      smsNoticeBody: "Order alert has been automatically dispatched via SMS to shop owner (<strong>0923245529</strong>) for immediate dispatch.",
      customer: "Customer:",
      phoneLabel: "Phone:",
      locationLabel: "Delivery Location:",
      paymentLabel: "Payment Status:",
      amountLabel: "Total Amount:",
      callShopBtn: "Call Husen (0923245529)",
      continueShoppingBtn: "Continue Shopping",
      trustDeliveryTitle: "Direct Neighborhood Delivery",
      trustDeliveryDesc: "Gendahara, Silasi, Atanatara, Peacock, Boli, Matwamisp & beyond in Adama.",
      trustSecureTitle: "Safe Payment Options",
      trustSecureDesc: "Chapa Gateway (Telebirr & CBE) or Cash on Delivery.",
      trustContactTitle: "Need Help? Contact Husen",
      selectQty: "Select Quantity",
      totalAmountLabel: "Total Amount:"
    }
  };

  // ==========================================================================
  // 3. PRODUCT DATABASE (4 Sample Products & Persistent Storage)
  // ==========================================================================
  const INITIAL_PRODUCTS = [
    {
      id: "prod-1",
      category: "kitchen",
      price: 1450,
      inStock: true,
      images: ["public/images/storage1.jpg"],
      name: {
        am: "የብርጭቆ ዕቃ መያዣ (4 ፍሬ)",
        om: "Qodaa Fuullee Nyaataa (Cimdi 4)",
        en: "Glass Storage Container Set (4-piece)"
      },
      spec: {
        am: "እርስ በርስ የሚገጣጠሙ፣ አየር የማያስገቡ ክሊፕ-መቆለፊያ ክዳን ያላቸው ጥራት ያላቸው የብርጭቆ ዕቃዎች።",
        om: "Qulqullina olaanaa, qilleensa kan hin galchine, cufaa jabaa kan qabu.",
        en: "Nesting, clip-lock lids, airtight premium glass containers."
      },
      fullDesc: {
        am: "4 የተለያየ መጠን ያላቸው የብርጭቆ ዕቃዎች። አየር የማያስገባ ክሊፕ ክዳን ያላቸው ሲሆን በማቀዝቀዣ፣ ማይክሮዌቭ እና በእቃ ማጠቢያ ውስጥ በደህና መጠቀም ይቻላል።",
        om: "Qodaa fuullee gosa 4 kan wal keessa galuu danda'an. Cufaa jabaa qilleensa ittisu kan qaban, firiijii fi maaykirooweevii keessatti fayyadamuuf kan ta'an.",
        en: "Set of 4 heavy-duty glass containers with snap-tight clip lids. Airtight silicone seal preserves freshness. Oven, microwave, freezer and dishwasher safe."
      },
      badge: {
        am: "ኦሪጅናል",
        om: "Qulqullina",
        en: "Original"
      }
    },
    {
      id: "prod-2",
      category: "health",
      price: 1200,
      inStock: true,
      images: ["public/images/vest1.jpg", "public/images/vest2.jpg"],
      name: {
        am: "የጀርባ አቋም ማስተካከያ ቬስት",
        om: "Vestii Dugdaa Sirreessu",
        en: "Posture Corrector Compression Vest"
      },
      spec: {
        am: "የጀርባ አጥንትን እና ትከሻን የሚያስተካክል፣ የሚለጠጥና ምቹ የድጋፍ ቬስት።",
        om: "Dugda fi ceekuuf deeggarsa kan kennu, mijataa fi sirreeffamuu kan danda'u.",
        en: "Adjustable back support, breathable compression vest."
      },
      fullDesc: {
        am: "ለትከሻና ለጀርባ ህመም ፈጣን እፎይታ የሚሰጥ። በልብስ ስር የማይታወቅ፣ የሚለጠጥና እንደ ሰውነት መጠን የሚስተካከል የጀርባ አቋም ማስተካከያ።",
        om: "Dhukkubbi dugdaa fi ceekuu salphisuuf kan gargaaru. Uffata jalatti kan hin mul'anne, salphaatti kan sirreeffamu fi hargansuuf mijataa ta'e.",
        en: "Ergonomic compression vest designed to pull shoulders back and align the spine. Breathable, discreet under clothing, and fully adjustable for all-day posture relief."
      },
      badge: {
        am: "ተወዳጅ",
        om: "Filatamaa",
        en: "Best Seller"
      }
    },
    {
      id: "prod-3",
      category: "kitchen",
      secondaryCategory: "home",
      price: 2850,
      inStock: true,
      images: ["public/images/blender1.jpg", "public/images/blender2.jpg"],
      name: {
        am: "ሳቺ 2-በ-1 ፈጪ እና መፍጫ",
        om: "Saachhi 2-in-1 Blenders (Makiinaa Harcaatuu)",
        en: "Saachhi 2-in-1 Blender"
      },
      spec: {
        am: "350W ኃይለኛ ሞተር፣ ሁለት ጃር እና ተጨማሪ መፍጫ ያለው ጥራት ያለው ማደባለቂያ።",
        om: "Motora humna 350W qabu, qodaa lama fi meeshaa daakuu wajjin.",
        en: "350W motor, two jars plus grinder attachment."
      },
      fullDesc: {
        am: "የሳቺ ኦሪጅናል 2-በ-1 ፈጪ። ፍራፍሬዎችን፣ ጁሶችን እና አትክልቶችን በቀላሉ የሚፈጭ ትልቅ ጃር እንዲሁም ቡና፣ ቅመማቅመም እና ደረቅ ነገሮችን የሚፈጭ ተጨማሪ ማያያዣ አለው።",
        om: "Saachhi 2-in-1 kan buna, mi'eessituu fi muduraa daakuuf gargaaru. Motora 350W jabaa, qodaa lama fi haaduu sibiila hin danda'amne qaba.",
        en: "Powerful 350W Saachhi blender featuring a large blending jug for juices/smoothies and a specialized stainless steel milling grinder for coffee, grains, and spices."
      },
      badge: {
        am: "ኃይለኛ",
        om: "Cimaa",
        en: "350W Power"
      }
    },
    {
      id: "prod-4",
      category: "beauty",
      price: 950,
      inStock: true,
      images: ["public/images/melanix.jpg"],
      name: {
        am: "ሜላኒክስ የፀጉር ቅባት",
        om: "Qoricha Rifeensaa Melanix",
        en: "Melanix Anti-Gray Hair Lotion"
      },
      spec: {
        am: "ከተፈጥሮ ንጥረነገሮች የተዘጋጀ፣ ሽበትን የሚከላከልና ተፈጥሮአዊ የፀጉር ቀለምን የሚመልስ ቅባት።",
        om: "Qoricha uumamaa rifeensa arrii ittisuu fi bifa uumamaa deebisu.",
        en: "All-natural botanical formula restores youthful natural hair."
      },
      fullDesc: {
        am: "ሜላኒክስ የጸጉርን ተፈጥሯዊ ሜላኒን በማነቃቃት የነጣ ፀጉርን ደረጃ በደረጃ ወደ ቀደመው ጥቁር ቀለም ይመልሳል። ምንም ዓይነት ጎጂ ኬሚካል የሌለው።",
        om: "Melanix rifeensa arrii gara bifa uumamaatti deebisuuf kan gargaaru. Kemikaala miidhaa qabu kan hin qabne, dhiiraafis dubartootaafis kan ta'u.",
        en: "Formulated with plant-derived actives to gently revitalize natural melanin synthesis in graying roots. Chemical dye-free, nourishing and suitable for both men and women."
      },
      badge: {
        am: "ተፈጥሯዊ",
        om: "Uumamaa",
        en: "Natural"
      }
    }
  ];

  // ==========================================================================
  // 4. APPLICATION STATE
  // ==========================================================================
  const state = {
    lang: sessionStorage.getItem('hom_lang') || 'en',
    activeCategory: 'all',
    products: JSON.parse(localStorage.getItem('hom_products')) || INITIAL_PRODUCTS,
    cart: JSON.parse(localStorage.getItem('hom_cart')) || [],
    
    // Telegram Mini App Active Product
    tgProduct: null,
    tgProductQty: 1,
    tgImageIndex: 0,
    
    // 2-Step Checkout State
    checkoutStep: 1,
    customerData: {
      name: '',
      phone: '',
      landmark: '',
      address: ''
    },
    selectedPaymentOption: 'chapa',
    
    // Admin state
    adminUnlocked: false,
    orders: []
  };

  const crossfadeTimers = {};
  let tgCrossfadeTimer = null;

  // ==========================================================================
  // 5. DOM REFERENCES
  // ==========================================================================
  const dom = {
    languageGate: document.getElementById('languageGate'),
    appShell: document.getElementById('appShell'),
    brandHomeLink: document.getElementById('brandHomeLink'),
    
    // Header controls
    headerLangBtn: document.getElementById('headerLangBtn'),
    headerLangDropdown: document.getElementById('headerLangDropdown'),
    checkEn: document.getElementById('checkEn'),
    checkAm: document.getElementById('checkAm'),
    checkOm: document.getElementById('checkOm'),
    
    openCartBtn: document.getElementById('openCartBtn'),
    cartCountBadge: document.getElementById('cartCountBadge'),
    categoryChipContainer: document.getElementById('categoryChipContainer'),
    productGrid: document.getElementById('productGrid'),
    productCountChip: document.getElementById('productCountChip'),
    
    heroBadgeText: document.getElementById('heroBadgeText'),
    heroHeadline: document.getElementById('heroHeadline'),
    heroSubtext: document.getElementById('heroSubtext'),
    statDelivery: document.getElementById('statDelivery'),
    statQuality: document.getElementById('statQuality'),
    statTelebirr: document.getElementById('statTelebirr'),
    catalogTitle: document.getElementById('catalogTitle'),
    catalogSubtitle: document.getElementById('catalogSubtitle'),
    trustDeliveryTitle: document.getElementById('trustDeliveryTitle'),
    trustDeliveryDesc: document.getElementById('trustDeliveryDesc'),
    trustSecureTitle: document.getElementById('trustSecureTitle'),
    trustSecureDesc: document.getElementById('trustSecureDesc'),
    trustContactTitle: document.getElementById('trustContactTitle'),

    // Telegram Mini App View
    tgProductView: document.getElementById('tgProductView'),
    closeTgViewBtn: document.getElementById('closeTgViewBtn'),
    tgHeaderCartBtn: document.getElementById('tgHeaderCartBtn'),
    tgHeroImageWrap: document.getElementById('tgHeroImageWrap'),
    tgProductTitle: document.getElementById('tgProductTitle'),
    tgUnitPrice: document.getElementById('tgUnitPrice'),
    tgStockPill: document.getElementById('tgStockPill'),
    tgDescHeading: document.getElementById('tgDescHeading'),
    tgProductDesc: document.getElementById('tgProductDesc'),
    tgQuantityLabel: document.getElementById('tgQuantityLabel'),
    tgQtyMinus: document.getElementById('tgQtyMinus'),
    tgQtyPlus: document.getElementById('tgQtyPlus'),
    tgQtyDisplay: document.getElementById('tgQtyDisplay'),
    tgTotalLabel: document.getElementById('tgTotalLabel'),
    tgDynamicTotalCalc: document.getElementById('tgDynamicTotalCalc'),
    tgTotalBreakdown: document.getElementById('tgTotalBreakdown'),
    tgAddToCartBtn: document.getElementById('tgAddToCartBtn'),
    tgBtnCartText: document.getElementById('tgBtnCartText'),
    tgBuyNowBtn: document.getElementById('tgBuyNowBtn'),
    tgBtnBuyText: document.getElementById('tgBtnBuyText'),
    tgBtnBuyPrice: document.getElementById('tgBtnBuyPrice'),

    // Cart Drawer
    cartBackdrop: document.getElementById('cartBackdrop'),
    cartDrawer: document.getElementById('cartDrawer'),
    closeCartBtn: document.getElementById('closeCartBtn'),
    cartDrawerTitle: document.getElementById('cartDrawerTitle'),
    cartHeaderCount: document.getElementById('cartHeaderCount'),
    cartAdamaBannerText: document.getElementById('cartAdamaBannerText'),
    cartItemsContainer: document.getElementById('cartItemsContainer'),
    cartSubtotalLabel: document.getElementById('cartSubtotalLabel'),
    cartSubtotalVal: document.getElementById('cartSubtotalVal'),
    cartDeliveryLabel: document.getElementById('cartDeliveryLabel'),
    cartDeliveryPill: document.getElementById('cartDeliveryPill'),
    cartTotalLabel: document.getElementById('cartTotalLabel'),
    cartGrandTotalVal: document.getElementById('cartGrandTotalVal'),
    proceedToCheckoutBtn: document.getElementById('proceedToCheckoutBtn'),
    btnCheckoutText: document.getElementById('btnCheckoutText'),
    btnCheckoutPrice: document.getElementById('btnCheckoutPrice'),

    // Checkout Modal (2-Step)
    checkoutBackdrop: document.getElementById('checkoutBackdrop'),
    checkoutModal: document.getElementById('checkoutModal'),
    closeCheckoutBtn: document.getElementById('closeCheckoutBtn'),
    checkoutModalTitle: document.getElementById('checkoutModalTitle'),
    checkoutModalSubtitle: document.getElementById('checkoutModalSubtitle'),
    pillStep1: document.getElementById('pillStep1'),
    pillStep2: document.getElementById('pillStep2'),
    checkoutItemsHeader: document.getElementById('checkoutItemsHeader'),
    checkoutSummaryTotal: document.getElementById('checkoutSummaryTotal'),
    checkoutSummaryItemsList: document.getElementById('checkoutSummaryItemsList'),
    
    // Step 1 Customer Info
    checkoutStep1: document.getElementById('checkoutStep1'),
    customerInfoForm: document.getElementById('customerInfoForm'),
    labelFullName: document.getElementById('labelFullName'),
    customerNameInput: document.getElementById('customerNameInput'),
    nameErrorMsg: document.getElementById('nameErrorMsg'),
    labelPhone: document.getElementById('labelPhone'),
    customerPhoneInput: document.getElementById('customerPhoneInput'),
    phoneHelperText: document.getElementById('phoneHelperText'),
    phoneErrorMsg: document.getElementById('phoneErrorMsg'),
    labelLandmark: document.getElementById('labelLandmark'),
    customerLandmarkInput: document.getElementById('customerLandmarkInput'),
    landmarkErrorMsg: document.getElementById('landmarkErrorMsg'),
    labelAddress: document.getElementById('labelAddress'),
    customerAddressInput: document.getElementById('customerAddressInput'),
    btnContinueToPayment: document.getElementById('btnContinueToPayment'),
    btnContinueText: document.getElementById('btnContinueText'),

    // Step 2 Payment Selection
    checkoutStep2: document.getElementById('checkoutStep2'),
    confirmedCustomerPill: document.getElementById('confirmedCustomerPill'),
    pillCustomerName: document.getElementById('pillCustomerName'),
    pillCustomerDetails: document.getElementById('pillCustomerDetails'),
    btnBackToStep1: document.getElementById('btnBackToStep1'),
    labelChoosePayment: document.getElementById('labelChoosePayment'),
    chapaName: document.getElementById('chapaName'),
    chapaDesc: document.getElementById('chapaDesc'),
    codName: document.getElementById('codName'),
    codDesc: document.getElementById('codDesc'),
    chapaInstruction: document.getElementById('chapaInstruction'),
    codInstruction: document.getElementById('codInstruction'),
    btnBackStep: document.getElementById('btnBackStep'),
    btnFinalizePayment: document.getElementById('btnFinalizePayment'),
    btnFinalizeText: document.getElementById('btnFinalizeText'),
    finalizeAmountVal: document.getElementById('finalizeAmountVal'),

    // Success Screen
    successBackdrop: document.getElementById('successBackdrop'),
    successTitle: document.getElementById('successTitle'),
    successSubtitle: document.getElementById('successSubtitle'),
    successOrderRefLabel: document.getElementById('successOrderRefLabel'),
    successOrderRefNumber: document.getElementById('successOrderRefNumber'),
    smsNoticeHeading: document.getElementById('smsNoticeHeading'),
    smsNoticeBody: document.getElementById('smsNoticeBody'),
    successCustomerLabel: document.getElementById('successCustomerLabel'),
    successCustomerVal: document.getElementById('successCustomerVal'),
    successPhoneLabel: document.getElementById('successPhoneLabel'),
    successPhoneVal: document.getElementById('successPhoneVal'),
    successLocationLabel: document.getElementById('successLocationLabel'),
    successLocationVal: document.getElementById('successLocationVal'),
    successPaymentLabel: document.getElementById('successPaymentLabel'),
    successPaymentVal: document.getElementById('successPaymentVal'),
    successAmountLabel: document.getElementById('successAmountLabel'),
    successAmountVal: document.getElementById('successAmountVal'),
    btnCallShopText: document.getElementById('btnCallShopText'),
    continueShoppingBtn: document.getElementById('continueShoppingBtn'),
    btnContinueShoppingText: document.getElementById('btnContinueShoppingText'),

    // Admin Portal
    adminBackdrop: document.getElementById('adminBackdrop'),
    openAdminBtn: document.getElementById('openAdminBtn'),
    closeAdminBtn: document.getElementById('closeAdminBtn'),
    adminAuthView: document.getElementById('adminAuthView'),
    adminPinInput: document.getElementById('adminPinInput'),
    adminLoginBtn: document.getElementById('adminLoginBtn'),
    adminDashboardView: document.getElementById('adminDashboardView'),
    adminTotalRevenue: document.getElementById('adminTotalRevenue'),
    adminOrderCount: document.getElementById('adminOrderCount'),
    adminProductsCount: document.getElementById('adminProductsCount'),
    adminProductsBadge: document.getElementById('adminProductsBadge'),
    adminTabProducts: document.getElementById('adminTabProducts'),
    adminTabOrders: document.getElementById('adminTabOrders'),
    adminOrdersBadge: document.getElementById('adminOrdersBadge'),
    adminPaneProducts: document.getElementById('adminPaneProducts'),
    adminPaneOrders: document.getElementById('adminPaneOrders'),
    adminProductList: document.getElementById('adminProductList'),
    adminOrdersList: document.getElementById('adminOrdersList'),
    openAddProductModalBtn: document.getElementById('openAddProductModalBtn'),

    // Product CRUD Editor Modal
    productEditorBackdrop: document.getElementById('productEditorBackdrop'),
    productEditorForm: document.getElementById('productEditorForm'),
    closeEditorBtn: document.getElementById('closeEditorBtn'),
    cancelEditorBtn: document.getElementById('cancelEditorBtn'),
    editorModalTitle: document.getElementById('editorModalTitle'),
    editProductId: document.getElementById('editProductId'),
    editorProdName: document.getElementById('editorProdName'),
    editorProdCategory: document.getElementById('editorProdCategory'),
    editorProdPrice: document.getElementById('editorProdPrice'),
    editorProdDesc: document.getElementById('editorProdDesc'),
    editorProdInStock: document.getElementById('editorProdInStock'),
    imageInputsList: document.getElementById('imageInputsList'),
    btnAddImageRow: document.getElementById('btnAddImageRow'),
    saveProductBtn: document.getElementById('saveProductBtn'),
    saveProductBtnText: document.getElementById('saveProductBtnText'),

    toastContainer: document.getElementById('toastContainer')
  };

  function t() {
    return I18N[state.lang] || I18N.en;
  }

  function formatETB(val) {
    return Number(val).toLocaleString() + " ETB";
  }

  function showToast(message, icon = '✓') {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;
    dom.toastContainer.appendChild(toast);
    setTimeout(() => {
      if (toast.parentNode) toast.parentNode.removeChild(toast);
    }, 3000);
  }

  // ==========================================================================
  // 6. LANGUAGE SYSTEM & HEADER DROPDOWN (Specification Section 1)
  // ==========================================================================
  function initLanguageSystem() {
    const savedLang = sessionStorage.getItem('hom_lang');
    if (savedLang) {
      state.lang = savedLang;
      dom.languageGate.classList.add('hidden');
    } else {
      dom.languageGate.classList.remove('hidden');
    }
    applyLanguage(state.lang);

    // Gate Buttons
    document.querySelectorAll('.gate-lang-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const selected = btn.getAttribute('data-lang');
        setLanguage(selected);
      });
    });

    // Header Globe Button Dropdown Toggle
    dom.headerLangBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      dom.headerLangDropdown.classList.toggle('active');
    });

    // Language Dropdown Items Selection
    document.querySelectorAll('.lang-dropdown-item').forEach(item => {
      item.addEventListener('click', () => {
        const lang = item.getAttribute('data-lang');
        setLanguage(lang);
        dom.headerLangDropdown.classList.remove('active');
      });
    });

    // Close Dropdown on outside click
    document.addEventListener('click', (e) => {
      if (!dom.headerLangDropdown.contains(e.target) && !dom.headerLangBtn.contains(e.target)) {
        dom.headerLangDropdown.classList.remove('active');
      }
    });
  }

  function setLanguage(lang) {
    state.lang = lang;
    sessionStorage.setItem('hom_lang', lang);
    dom.languageGate.classList.add('hidden');
    applyLanguage(lang);
    showToast(lang === 'am' ? 'ቋንቋ ወደ አማርኛ ተቀይሯል' : lang === 'om' ? 'Afaan Oromootti jijjiirameera' : 'Language set to English', '🌐');
  }

  function applyLanguage(lang) {
    const text = t();
    document.documentElement.lang = lang;

    // Update checkmarks in header dropdown
    dom.checkEn.style.opacity = lang === 'en' ? '1' : '0';
    dom.checkAm.style.opacity = lang === 'am' ? '1' : '0';
    dom.checkOm.style.opacity = lang === 'om' ? '1' : '0';

    document.querySelectorAll('.lang-dropdown-item').forEach(item => {
      item.classList.toggle('active', item.getAttribute('data-lang') === lang);
    });

    dom.heroBadgeText.textContent = text.heroBadge;
    dom.heroHeadline.textContent = text.heroHeadline;
    dom.heroSubtext.textContent = text.heroSubtext;
    dom.statDelivery.textContent = text.statDelivery;
    dom.statQuality.textContent = text.statQuality;
    dom.statTelebirr.textContent = text.statTelebirr;
    dom.catalogTitle.textContent = text.catalogTitle;
    dom.catalogSubtitle.textContent = text.catalogSubtitle;
    dom.trustDeliveryTitle.textContent = text.trustDeliveryTitle;
    dom.trustDeliveryDesc.textContent = text.trustDeliveryDesc;
    dom.trustSecureTitle.textContent = text.trustSecureTitle;
    dom.trustSecureDesc.textContent = text.trustSecureDesc;
    dom.trustContactTitle.textContent = text.trustContactTitle;
    
    // Cart strings
    dom.cartDrawerTitle.textContent = text.cartTitle;
    dom.cartAdamaBannerText.textContent = text.cartAdamaBannerText;
    dom.cartSubtotalLabel.textContent = text.subtotal;
    dom.cartDeliveryLabel.textContent = text.adamaDelivery;
    dom.cartDeliveryPill.textContent = text.freeDelivery;
    dom.cartTotalLabel.textContent = text.grandTotal;
    dom.btnCheckoutText.textContent = text.proceedCheckout;

    // Telegram view strings
    dom.tgQuantityLabel.textContent = text.selectQty;
    dom.tgTotalLabel.textContent = text.totalAmountLabel;
    dom.tgBtnCartText.textContent = text.addToCart;
    dom.tgBtnBuyText.textContent = text.buyNow;
    
    // Checkout strings
    dom.pillStep1.textContent = text.step1Pill;
    dom.pillStep2.textContent = text.step2Pill;
    dom.checkoutModalTitle.textContent = state.checkoutStep === 1 ? text.checkoutTitle : text.step2Pill;
    dom.checkoutModalSubtitle.textContent = text.checkoutSubtitle;
    dom.checkoutItemsHeader.textContent = text.orderItems;
    dom.labelFullName.textContent = text.fullName;
    dom.labelPhone.textContent = text.phone;
    dom.phoneHelperText.textContent = text.phoneHelper;
    dom.labelLandmark.textContent = text.landmarkLabel;
    dom.customerLandmarkInput.placeholder = text.landmarkPlaceholder;
    dom.labelAddress.innerHTML = `${text.addressLabel} <span class="optional-tag">(Optional)</span>`;
    dom.customerAddressInput.placeholder = text.addressPlaceholder;
    dom.btnContinueText.textContent = text.continueToPayment;
    
    dom.labelChoosePayment.innerHTML = `<span>${text.choosePaymentLabel}</span>`;
    dom.chapaName.textContent = text.chapaName;
    dom.chapaDesc.textContent = text.chapaDesc;
    dom.codName.textContent = text.codName;
    dom.codDesc.textContent = text.codDesc;
    
    dom.successTitle.textContent = text.orderSuccessTitle;
    dom.successSubtitle.textContent = text.orderSuccessSub;
    dom.successOrderRefLabel.textContent = text.orderRef;
    dom.smsNoticeHeading.textContent = text.smsNoticeTitle;
    dom.smsNoticeBody.innerHTML = text.smsNoticeBody;
    dom.successCustomerLabel.textContent = text.customer;
    dom.successPhoneLabel.textContent = text.phoneLabel;
    dom.successLocationLabel.textContent = text.locationLabel;
    dom.successPaymentLabel.textContent = text.paymentLabel;
    dom.successAmountLabel.textContent = text.amountLabel;
    dom.btnCallShopText.textContent = text.callShopBtn;
    dom.btnContinueShoppingText.textContent = text.continueShoppingBtn;

    renderCategoryChips();
    renderProducts();
    updateCartUI();
    updateStep2FinalizeButton();
  }

  // ==========================================================================
  // 7. CATEGORY CHIPS
  // ==========================================================================
  function renderCategoryChips() {
    const cats = t().categories;
    const catKeys = [
      { key: 'all', label: cats.all, icon: '✨' },
      { key: 'kitchen', label: cats.kitchen, icon: '🍳' },
      { key: 'home', label: cats.home, icon: '🏠' },
      { key: 'beauty', label: cats.beauty, icon: '✨' },
      { key: 'health', label: cats.health, icon: '🌿' }
    ];

    dom.categoryChipContainer.innerHTML = catKeys.map(cat => {
      const activeClass = state.activeCategory === cat.key ? 'active' : '';
      return `
        <button type="button" class="category-chip ${activeClass}" data-cat="${cat.key}">
          <span>${cat.icon}</span>
          <span>${cat.label}</span>
        </button>
      `;
    }).join('');

    dom.categoryChipContainer.querySelectorAll('.category-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        state.activeCategory = chip.getAttribute('data-cat');
        dom.categoryChipContainer.querySelectorAll('.category-chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        renderProducts();
      });
    });
  }

  // ==========================================================================
  // 8. PRODUCT CATALOG & 5-SECOND CROSSFADES
  // ==========================================================================
  function getProductName(prod) {
    if (typeof prod.name === 'object') {
      return prod.name[state.lang] || prod.name.en || Object.values(prod.name)[0] || 'Product';
    }
    return prod.name || 'Product';
  }

  function getProductSpec(prod) {
    if (typeof prod.spec === 'object') {
      return prod.spec[state.lang] || prod.spec.en || Object.values(prod.spec)[0] || '';
    }
    return prod.spec || '';
  }

  function getProductDesc(prod) {
    if (typeof prod.fullDesc === 'object') {
      return prod.fullDesc[state.lang] || prod.fullDesc.en || Object.values(prod.fullDesc)[0] || getProductSpec(prod);
    }
    return prod.fullDesc || getProductSpec(prod);
  }

  function renderProducts() {
    Object.values(crossfadeTimers).forEach(timer => clearInterval(timer));

    const text = t();
    const filtered = state.products.filter(p => {
      if (state.activeCategory === 'all') return true;
      return p.category === state.activeCategory || p.secondaryCategory === state.activeCategory;
    });

    dom.productCountChip.textContent = `${filtered.length} ${text.itemsCount}`;

    dom.productGrid.innerHTML = filtered.map(prod => {
      const name = getProductName(prod);
      const spec = getProductSpec(prod);
      const badge = prod.badge ? (typeof prod.badge === 'object' ? (prod.badge[state.lang] || prod.badge.en) : prod.badge) : '';
      const isMulti = prod.images && prod.images.length > 1;

      const imagesHtml = (prod.images && prod.images.length ? prod.images : ['public/images/storage1.jpg']).map((imgSrc, idx) => `
        <img src="${imgSrc}" alt="${name}" class="product-img ${idx === 0 ? 'active' : 'inactive'}" data-img-index="${idx}" onerror="this.src='public/images/storage1.jpg'">
      `).join('');

      const multiIndicator = isMulti ? `
        <div class="multi-photo-indicator" id="ind-${prod.id}">
          ${prod.images.map((_, i) => `<span class="multi-photo-dot ${i === 0 ? 'active' : ''}"></span>`).join('')}
        </div>
      ` : '';

      const stockBadge = !prod.inStock ? `
        <span class="card-badge" style="background-color: #ef4444; color: #fff;">${text.outOfStock}</span>
      ` : (badge ? `<span class="card-badge">${badge}</span>` : '');

      return `
        <div class="product-card ${!prod.inStock ? 'out-of-stock' : ''}" data-prod-id="${prod.id}">
          <div class="product-image-container">
            ${stockBadge}
            ${multiIndicator}
            <div class="product-crossfade-wrap" id="crossfade-${prod.id}">
              ${imagesHtml}
            </div>
          </div>

          <div class="product-card-body">
            <span class="product-category-tag">${text.categories[prod.category] || prod.category}</span>
            <h3 class="product-title">${name}</h3>
            <p class="product-spec-bullet">${spec}</p>

            <div class="product-card-footer">
              <div class="product-price-wrap">
                <span class="product-price-val">${Number(prod.price).toLocaleString()}</span>
                <span class="product-price-currency">ETB</span>
              </div>
              <button type="button" class="btn-buy-now" data-action="tg-open" data-prod-id="${prod.id}" ${!prod.inStock ? 'disabled' : ''}>
                ${text.buyNow}
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');

    filtered.forEach(prod => {
      const card = dom.productGrid.querySelector(`[data-prod-id="${prod.id}"]`);
      if (!card) return;

      card.addEventListener('click', () => {
        openTelegramProductView(prod);
      });

      if (prod.images && prod.images.length > 1) {
        let currentIdx = 0;
        crossfadeTimers[prod.id] = setInterval(() => {
          const wrap = document.getElementById(`crossfade-${prod.id}`);
          const ind = document.getElementById(`ind-${prod.id}`);
          if (!wrap) return;

          const imgs = wrap.querySelectorAll('.product-img');
          const dots = ind ? ind.querySelectorAll('.multi-photo-dot') : [];

          if (imgs.length <= 1) return;

          imgs[currentIdx].classList.remove('active');
          imgs[currentIdx].classList.add('inactive');
          if (dots[currentIdx]) dots[currentIdx].classList.remove('active');

          currentIdx = (currentIdx + 1) % imgs.length;

          imgs[currentIdx].classList.remove('inactive');
          imgs[currentIdx].classList.add('active');
          if (dots[currentIdx]) dots[currentIdx].classList.add('active');
        }, 5000);
      }
    });
  }

  // ==========================================================================
  // 9. TELEGRAM MINI APP PRODUCT DETAIL FULL-SCREEN VIEW
  // ==========================================================================
  function openTelegramProductView(prod) {
    if (!prod.inStock) {
      showToast(t().outOfStock, '⚠️');
      return;
    }

    state.tgProduct = prod;
    state.tgProductQty = 1;
    state.tgImageIndex = 0;

    if (window.Telegram && window.Telegram.WebApp) {
      try { window.Telegram.WebApp.expand(); } catch (e) {}
    }

    const name = getProductName(prod);
    const desc = getProductDesc(prod);
    const isMulti = prod.images && prod.images.length > 1;

    dom.tgProductTitle.textContent = name;
    dom.tgProductDesc.textContent = desc;
    dom.tgUnitPrice.textContent = `${Number(prod.price).toLocaleString()} ETB`;
    dom.tgQtyDisplay.textContent = '1';

    updateTelegramDynamicTotal();

    if (tgCrossfadeTimer) clearInterval(tgCrossfadeTimer);

    const images = prod.images && prod.images.length ? prod.images : ['public/images/storage1.jpg'];
    const imagesHtml = images.map((src, idx) => `
      <img src="${src}" alt="${name}" class="tg-hero-img ${idx === 0 ? 'active' : 'inactive'}" data-tg-img="${idx}" onerror="this.src='public/images/storage1.jpg'">
    `).join('');

    const dotsHtml = isMulti ? `
      <div class="tg-thumb-dots">
        ${images.map((_, i) => `<span class="tg-dot ${i === 0 ? 'active' : ''}" data-tg-dot="${i}"></span>`).join('')}
      </div>
    ` : '';

    dom.tgHeroImageWrap.innerHTML = imagesHtml + dotsHtml;

    if (isMulti) {
      dom.tgHeroImageWrap.querySelectorAll('.tg-dot').forEach(dot => {
        dot.addEventListener('click', () => {
          const idx = parseInt(dot.getAttribute('data-tg-dot'), 10);
          switchTgImage(idx);
        });
      });

      let currentTgIdx = 0;
      tgCrossfadeTimer = setInterval(() => {
        currentTgIdx = (currentTgIdx + 1) % images.length;
        switchTgImage(currentTgIdx);
      }, 5000);
    }

    dom.tgProductView.classList.add('active');
    dom.tgProductView.setAttribute('aria-hidden', 'false');
  }

  function switchTgImage(idx) {
    const imgs = dom.tgHeroImageWrap.querySelectorAll('.tg-hero-img');
    const dots = dom.tgHeroImageWrap.querySelectorAll('.tg-dot');
    imgs.forEach((img, i) => {
      img.classList.toggle('active', i === idx);
      img.classList.toggle('inactive', i !== idx);
    });
    dots.forEach((d, i) => {
      d.classList.toggle('active', i === idx);
    });
    state.tgImageIndex = idx;
  }

  function closeTelegramProductView() {
    if (tgCrossfadeTimer) clearInterval(tgCrossfadeTimer);
    dom.tgProductView.classList.remove('active');
    dom.tgProductView.setAttribute('aria-hidden', 'true');
  }

  dom.closeTgViewBtn.addEventListener('click', closeTelegramProductView);
  dom.tgHeaderCartBtn.addEventListener('click', () => {
    closeTelegramProductView();
    openCartDrawer();
  });

  dom.tgQtyMinus.addEventListener('click', () => {
    if (state.tgProductQty > 1) {
      state.tgProductQty--;
      dom.tgQtyDisplay.textContent = state.tgProductQty;
      updateTelegramDynamicTotal();
    }
  });

  dom.tgQtyPlus.addEventListener('click', () => {
    if (state.tgProductQty < 25) {
      state.tgProductQty++;
      dom.tgQtyDisplay.textContent = state.tgProductQty;
      updateTelegramDynamicTotal();
    }
  });

  function updateTelegramDynamicTotal() {
    if (!state.tgProduct) return;
    const total = state.tgProduct.price * state.tgProductQty;
    dom.tgDynamicTotalCalc.textContent = formatETB(total);
    dom.tgTotalBreakdown.textContent = `(${Number(state.tgProduct.price).toLocaleString()} ETB × ${state.tgProductQty})`;
    dom.tgBtnBuyPrice.textContent = formatETB(total);
  }

  dom.tgAddToCartBtn.addEventListener('click', () => {
    if (!state.tgProduct) return;
    addToCart(state.tgProduct.id, state.tgProductQty);
    showToast(t().addedToCartToast, '🛒');
  });

  dom.tgBuyNowBtn.addEventListener('click', () => {
    if (!state.tgProduct) return;
    addToCart(state.tgProduct.id, state.tgProductQty);
    closeTelegramProductView();
    openCheckoutModal();
  });

  // ==========================================================================
  // 10. SHOPPING CART SYSTEM
  // ==========================================================================
  function addToCart(productId, qty = 1) {
    const existing = state.cart.find(item => item.id === productId);
    if (existing) {
      existing.qty += qty;
    } else {
      state.cart.push({ id: productId, qty: qty });
    }
    saveCart();
    updateCartUI();
    bumpCartBadge();
  }

  function updateCartItemQty(productId, delta) {
    const item = state.cart.find(i => i.id === productId);
    if (!item) return;

    item.qty += delta;
    if (item.qty <= 0) {
      state.cart = state.cart.filter(i => i.id !== productId);
    }
    saveCart();
    updateCartUI();
  }

  function saveCart() {
    localStorage.setItem('hom_cart', JSON.stringify(state.cart));
  }

  function bumpCartBadge() {
    dom.cartCountBadge.classList.add('bump');
    setTimeout(() => dom.cartCountBadge.classList.remove('bump'), 300);
  }

  function getCartSubtotal() {
    return state.cart.reduce((sum, item) => {
      const prod = state.products.find(p => p.id === item.id);
      return sum + (prod ? prod.price * item.qty : 0);
    }, 0);
  }

  function updateCartUI() {
    const text = t();
    const totalCount = state.cart.reduce((sum, item) => sum + item.qty, 0);
    dom.cartCountBadge.textContent = totalCount;
    dom.cartHeaderCount.textContent = `(${totalCount} ${text.itemsCount})`;

    const subtotal = getCartSubtotal();
    dom.cartSubtotalVal.textContent = formatETB(subtotal);
    dom.cartGrandTotalVal.textContent = formatETB(subtotal);
    dom.btnCheckoutPrice.textContent = formatETB(subtotal);

    if (state.cart.length === 0) {
      dom.cartItemsContainer.innerHTML = `
        <div class="cart-empty-state">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="margin: 0 auto; color: var(--text-light);"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
          <p><strong>${text.cartEmpty}</strong></p>
          <small>${text.cartEmptySub}</small>
        </div>
      `;
      dom.proceedToCheckoutBtn.disabled = true;
      dom.proceedToCheckoutBtn.style.opacity = '0.5';
      return;
    }

    dom.proceedToCheckoutBtn.disabled = false;
    dom.proceedToCheckoutBtn.style.opacity = '1';

    dom.cartItemsContainer.innerHTML = state.cart.map(item => {
      const prod = state.products.find(p => p.id === item.id);
      if (!prod) return '';
      const name = getProductName(prod);
      const itemSubtotal = prod.price * item.qty;
      const thumb = prod.images && prod.images.length ? prod.images[0] : 'public/images/storage1.jpg';

      return `
        <div class="cart-item-row">
          <img src="${thumb}" alt="${name}" class="cart-item-thumb" onerror="this.src='public/images/storage1.jpg'">
          <div class="cart-item-details">
            <div class="cart-item-name">${name}</div>
            <div class="cart-item-unit-price">${Number(prod.price).toLocaleString()} ETB × ${item.qty}</div>
            <div class="cart-item-subtotal">${itemSubtotal.toLocaleString()} ETB</div>
          </div>
          <div class="cart-item-stepper">
            <button type="button" class="cart-step-btn" data-cart-action="minus" data-id="${prod.id}">−</button>
            <span class="cart-step-qty">${item.qty}</span>
            <button type="button" class="cart-step-btn" data-cart-action="plus" data-id="${prod.id}">+</button>
          </div>
        </div>
      `;
    }).join('');

    dom.cartItemsContainer.querySelectorAll('[data-cart-action]').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const action = btn.getAttribute('data-cart-action');
        updateCartItemQty(id, action === 'plus' ? 1 : -1);
      });
    });
  }

  function openCartDrawer() {
    updateCartUI();
    dom.cartBackdrop.classList.add('active');
    dom.cartBackdrop.setAttribute('aria-hidden', 'false');
  }

  function closeCartDrawer() {
    dom.cartBackdrop.classList.remove('active');
    dom.cartBackdrop.setAttribute('aria-hidden', 'true');
  }

  dom.openCartBtn.addEventListener('click', openCartDrawer);
  dom.closeCartBtn.addEventListener('click', closeCartDrawer);
  dom.cartBackdrop.addEventListener('click', (e) => {
    if (e.target === dom.cartBackdrop) closeCartDrawer();
  });

  dom.proceedToCheckoutBtn.addEventListener('click', () => {
    closeCartDrawer();
    openCheckoutModal();
  });

  // ==========================================================================
  // 11. 2-STEP CHECKOUT FLOW
  // ==========================================================================
  function openCheckoutModal() {
    if (state.cart.length === 0) {
      showToast(t().cartEmpty, '⚠️');
      return;
    }

    if (window.Telegram && window.Telegram.WebApp) {
      try { window.Telegram.WebApp.expand(); } catch (e) {}
    }

    const total = getCartSubtotal();
    dom.checkoutSummaryTotal.textContent = formatETB(total);
    dom.finalizeAmountVal.textContent = formatETB(total);

    dom.checkoutSummaryItemsList.innerHTML = state.cart.map(item => {
      const prod = state.products.find(p => p.id === item.id);
      if (!prod) return '';
      const name = getProductName(prod);
      return `<span class="summary-item-pill">${name} × ${item.qty}</span>`;
    }).join('');

    goToStep(1);

    dom.checkoutBackdrop.classList.add('active');
    dom.checkoutBackdrop.setAttribute('aria-hidden', 'false');
  }

  function closeCheckoutModal() {
    dom.checkoutBackdrop.classList.remove('active');
    dom.checkoutBackdrop.setAttribute('aria-hidden', 'true');
  }

  dom.closeCheckoutBtn.addEventListener('click', closeCheckoutModal);
  dom.checkoutBackdrop.addEventListener('click', (e) => {
    if (e.target === dom.checkoutBackdrop) closeCheckoutModal();
  });

  function goToStep(step) {
    state.checkoutStep = step;
    if (step === 1) {
      dom.pillStep1.classList.add('active');
      dom.pillStep2.classList.remove('active');
      dom.checkoutStep1.style.display = 'block';
      dom.checkoutStep2.style.display = 'none';
      dom.checkoutModalTitle.textContent = t().checkoutTitle;
    } else {
      dom.pillStep1.classList.remove('active');
      dom.pillStep2.classList.add('active');
      dom.checkoutStep1.style.display = 'none';
      dom.checkoutStep2.style.display = 'block';
      dom.checkoutModalTitle.textContent = t().step2Pill;

      dom.pillCustomerName.textContent = state.customerData.name;
      dom.pillCustomerDetails.textContent = `${state.customerData.phone} • ${state.customerData.landmark}`;
      updateStep2FinalizeButton();
    }
  }

  document.querySelectorAll('.quick-hood-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      dom.customerLandmarkInput.value = btn.getAttribute('data-hood');
      dom.landmarkErrorMsg.style.display = 'none';
    });
  });

  dom.customerInfoForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = dom.customerNameInput.value.trim();
    const phone = dom.customerPhoneInput.value.trim();
    const landmark = dom.customerLandmarkInput.value.trim();
    const address = dom.customerAddressInput.value.trim();

    let hasError = false;

    if (!name) {
      dom.nameErrorMsg.style.display = 'block';
      hasError = true;
    } else {
      dom.nameErrorMsg.style.display = 'none';
    }

    const cleanDigits = phone.replace(/[^0-9]/g, '');
    const isEthPhone = cleanDigits.startsWith('09') || cleanDigits.startsWith('07') || cleanDigits.startsWith('2519') || cleanDigits.startsWith('2517') || (cleanDigits.length === 9 && (cleanDigits.startsWith('9') || cleanDigits.startsWith('7')));
    
    if (!phone || cleanDigits.length < 9 || !isEthPhone) {
      dom.phoneErrorMsg.style.display = 'block';
      hasError = true;
    } else {
      dom.phoneErrorMsg.style.display = 'none';
    }

    if (!landmark) {
      dom.landmarkErrorMsg.style.display = 'block';
      hasError = true;
    } else {
      dom.landmarkErrorMsg.style.display = 'none';
    }

    if (hasError) return;

    let formattedPhone = phone;
    if (cleanDigits.startsWith('251')) {
      formattedPhone = '0' + cleanDigits.substring(3);
    } else if (cleanDigits.length === 9) {
      formattedPhone = '0' + cleanDigits;
    }

    state.customerData = {
      name,
      phone: formattedPhone,
      landmark,
      address
    };

    goToStep(2);
  });

  dom.btnBackToStep1.addEventListener('click', () => goToStep(1));
  dom.btnBackStep.addEventListener('click', () => goToStep(1));

  document.querySelectorAll('input[name="paymentOption"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
      state.selectedPaymentOption = e.target.value;
      document.querySelectorAll('.payment-card').forEach(c => c.classList.remove('selected'));
      e.target.closest('.payment-card').classList.add('selected');

      if (state.selectedPaymentOption === 'chapa') {
        dom.chapaInstruction.style.display = 'flex';
        dom.codInstruction.style.display = 'none';
      } else {
        dom.chapaInstruction.style.display = 'none';
        dom.codInstruction.style.display = 'flex';
      }
      updateStep2FinalizeButton();
    });
  });

  function updateStep2FinalizeButton() {
    const text = t();
    const total = getCartSubtotal();
    dom.finalizeAmountVal.textContent = formatETB(total);

    if (state.selectedPaymentOption === 'chapa') {
      dom.btnFinalizeText.textContent = text.btnFinalizeChapa;
    } else {
      dom.btnFinalizeText.textContent = text.btnFinalizeCod;
    }
  }

  // ==========================================================================
  // 12. PAYMENT EXECUTION LOGIC (Chapa & Cash on Delivery)
  // ==========================================================================
  dom.btnFinalizePayment.addEventListener('click', async () => {
    const total = getCartSubtotal();
    if (total <= 0) return;

    const itemsSummary = state.cart.map(item => {
      const prod = state.products.find(p => p.id === item.id);
      const name = prod ? getProductName(prod) : 'Item';
      return `${name} (x${item.qty})`;
    }).join(', ');

    // OPTION B: CASH ON DELIVERY
    if (state.selectedPaymentOption === 'cod') {
      dom.btnFinalizePayment.disabled = true;
      dom.btnFinalizePayment.style.opacity = '0.7';

      try {
        const payload = {
          customer: state.customerData.name,
          phone: state.customerData.phone,
          location: state.customerData.landmark,
          address: state.customerData.address,
          total: total,
          itemsSummary: itemsSummary
        };

        const res = await fetch('/api/orders/cod', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        const data = await res.json();
        dom.btnFinalizePayment.disabled = false;
        dom.btnFinalizePayment.style.opacity = '1';

        if (data.success && data.order) {
          closeCheckoutModal();
          showOrderSuccessScreen(data.order);
        } else {
          showToast('Failed to place order. Please try again.', '⚠️');
        }
      } catch (err) {
        console.error('[COD ERROR]', err);
        dom.btnFinalizePayment.disabled = false;
        dom.btnFinalizePayment.style.opacity = '1';
        showToast('Network error submitting order.', '⚠️');
      }
      return;
    }

    // OPTION A: CHAPA PAYMENT
    if (state.selectedPaymentOption === 'chapa') {
      dom.btnFinalizePayment.disabled = true;
      dom.btnFinalizePayment.style.opacity = '0.7';
      dom.btnFinalizeText.textContent = 'Connecting to Chapa...';

      try {
        const txRef = 'HOM-tx-' + Date.now();
        const cleanPhone = state.customerData.phone.replace(/[^0-9]/g, '');

        const chapaInitPayload = {
          amount: total,
          currency: "ETB",
          email: `${cleanPhone}@husenmarketing.et`,
          first_name: state.customerData.name,
          phone_number: state.customerData.phone,
          location: state.customerData.landmark,
          address: state.customerData.address,
          tx_ref: txRef,
          itemsSummary: itemsSummary
        };

        const res = await fetch('/api/chapa/initialize', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(chapaInitPayload)
        });

        const data = await res.json();
        dom.btnFinalizePayment.disabled = false;
        dom.btnFinalizePayment.style.opacity = '1';
        updateStep2FinalizeButton();

        if (data.status === 'success' && data.checkout_url) {
          showToast('Redirecting to secure Chapa payment...', '💳');
          state.cart = [];
          saveCart();
          updateCartUI();

          setTimeout(() => {
            window.location.href = data.checkout_url;
          }, 600);
        } else {
          showToast('Unable to initiate Chapa transaction.', '⚠️');
        }
      } catch (err) {
        console.error('[CHAPA INIT ERROR]', err);
        dom.btnFinalizePayment.disabled = false;
        dom.btnFinalizePayment.style.opacity = '1';
        updateStep2FinalizeButton();
        showToast('Connection error with payment gateway.', '⚠️');
      }
    }
  });

  // ==========================================================================
  // 13. SUCCESS SCREEN DISPLAY
  // ==========================================================================
  function showOrderSuccessScreen(order) {
    dom.successOrderRefNumber.textContent = order.id;
    dom.successCustomerVal.textContent = order.customer;
    dom.successPhoneVal.textContent = order.phone;
    dom.successLocationVal.textContent = order.address ? `${order.location}, ${order.address}` : order.location;
    dom.successPaymentVal.textContent = order.method;
    dom.successAmountVal.textContent = formatETB(order.total);

    state.cart = [];
    saveCart();
    updateCartUI();

    dom.successBackdrop.classList.add('active');
    dom.successBackdrop.setAttribute('aria-hidden', 'false');

    showToast(t().orderSuccessTitle, '🎉');
  }

  dom.continueShoppingBtn.addEventListener('click', () => {
    dom.successBackdrop.classList.remove('active');
    dom.successBackdrop.setAttribute('aria-hidden', 'true');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  function checkUrlPaymentCallback() {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('payment') === 'success') {
      const txRef = urlParams.get('tx_ref');
      if (txRef) {
        fetch(`/api/chapa/verify/${encodeURIComponent(txRef)}`)
          .then(res => res.json())
          .then(data => {
            if (data && data.order) {
              showOrderSuccessScreen(data.order);
            }
          })
          .catch(err => console.warn('[VERIFY NOTICE]', err));
      }
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }

  // ==========================================================================
  // 14. ADMIN PORTAL & FULL PRODUCT CRUD SYSTEM (Specification Section 3)
  // ==========================================================================
  function openAdminPortal() {
    dom.adminBackdrop.classList.add('active');
    dom.adminBackdrop.setAttribute('aria-hidden', 'false');
    if (state.adminUnlocked) {
      dom.adminAuthView.style.display = 'none';
      dom.adminDashboardView.style.display = 'block';
      fetchAdminOrders();
      renderAdminProductList();
    } else {
      dom.adminAuthView.style.display = 'block';
      dom.adminDashboardView.style.display = 'none';
      dom.adminPinInput.value = '';
      dom.adminPinInput.focus();
    }
  }

  function closeAdminPortal() {
    dom.adminBackdrop.classList.remove('active');
    dom.adminBackdrop.setAttribute('aria-hidden', 'true');
  }

  dom.openAdminBtn.addEventListener('click', openAdminPortal);
  dom.closeAdminBtn.addEventListener('click', closeAdminPortal);
  dom.adminBackdrop.addEventListener('click', (e) => {
    if (e.target === dom.adminBackdrop) closeAdminPortal();
  });

  dom.adminLoginBtn.addEventListener('click', () => {
    const pin = dom.adminPinInput.value.trim();
    if (pin === '1234') {
      state.adminUnlocked = true;
      dom.adminAuthView.style.display = 'none';
      dom.adminDashboardView.style.display = 'block';
      fetchAdminOrders();
      renderAdminProductList();
      showToast('Admin Portal Unlocked', '🔓');
    } else {
      showToast('Invalid PIN. Use demo PIN: 1234', '⚠️');
      dom.adminPinInput.focus();
    }
  });

  async function fetchAdminOrders() {
    try {
      const res = await fetch('/api/orders');
      const data = await res.json();
      state.orders = data.orders || [];
      renderAdminOrders();
    } catch (e) {
      console.warn('[ADMIN FETCH NOTICE]', e);
      renderAdminOrders();
    }
  }

  function renderAdminOrders() {
    const totalRev = state.orders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);
    dom.adminTotalRevenue.textContent = formatETB(totalRev);
    dom.adminOrderCount.textContent = state.orders.length;
    dom.adminOrdersBadge.textContent = state.orders.length;

    if (state.orders.length === 0) {
      dom.adminOrdersList.innerHTML = '<p style="text-align: center; color: var(--text-muted); font-size: 0.8rem;">No orders placed yet.</p>';
    } else {
      dom.adminOrdersList.innerHTML = state.orders.map(order => `
        <div class="admin-order-card">
          <div class="admin-order-header">
            <span>${order.id} • ${order.date}</span>
            <div>
              <span class="sms-badge-sent">SMS Sent to 0923245529</span>
              <span class="admin-order-status ${order.status.includes('Paid') ? 'paid' : order.status.includes('Delivered') ? 'delivered' : 'pending'}">${order.status}</span>
            </div>
          </div>
          <div style="font-size: 0.84rem; font-weight: 700; color: var(--text-main); margin-bottom: 2px;">
            ${order.customer} (${order.phone})
          </div>
          <div style="font-size: 0.75rem; color: var(--text-muted); margin-bottom: 4px;">
            📍 ${order.location} ${order.address ? '• ' + order.address : ''}
          </div>
          <div style="font-size: 0.75rem; color: var(--text-muted); margin-bottom: 6px;">
            💳 ${order.method} • 📦 ${order.itemsSummary}
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border-subtle); padding-top: 6px;">
            <strong style="color: var(--primary-red); font-size: 0.95rem;">${formatETB(order.total)}</strong>
            <span style="font-size: 0.75rem; color: #10b981; font-weight: 700;">Owner Alert Dispatched</span>
          </div>
        </div>
      `).join('');
    }
  }

  function renderAdminProductList() {
    dom.adminProductsCount.textContent = state.products.filter(p => p.inStock).length;
    dom.adminProductsBadge.textContent = state.products.length;

    dom.adminProductList.innerHTML = state.products.map(prod => {
      const name = getProductName(prod);
      const thumb = prod.images && prod.images.length ? prod.images[0] : 'public/images/storage1.jpg';
      return `
        <div class="admin-prod-item" data-id="${prod.id}">
          <div class="admin-prod-info">
            <img src="${thumb}" alt="${name}" class="admin-prod-img" onerror="this.src='public/images/storage1.jpg'">
            <div>
              <div class="admin-prod-name">${name}</div>
              <div class="admin-prod-price">${Number(prod.price).toLocaleString()} ETB • ${prod.category}</div>
            </div>
          </div>

          <div class="admin-prod-actions">
            <label class="switch-label">
              <span>${prod.inStock ? 'In Stock' : 'Out'}</span>
              <label class="switch">
                <input type="checkbox" data-admin-prod="${prod.id}" ${prod.inStock ? 'checked' : ''}>
                <span class="slider"></span>
              </label>
            </label>

            <!-- Edit Button -->
            <button type="button" class="btn-icon-action btn-edit-prod" data-edit-id="${prod.id}" title="Edit Product">
              ✏️
            </button>

            <!-- Delete Button -->
            <button type="button" class="btn-icon-action btn-delete-prod" data-delete-id="${prod.id}" title="Delete Product">
              🗑️
            </button>
          </div>
        </div>
      `;
    }).join('');

    // In-Stock Switch Handler
    dom.adminProductList.querySelectorAll('input[data-admin-prod]').forEach(box => {
      box.addEventListener('change', () => {
        const id = box.getAttribute('data-admin-prod');
        const prod = state.products.find(p => p.id === id);
        if (prod) {
          prod.inStock = box.checked;
          saveProducts();
          renderProducts();
          renderAdminProductList();
          showToast(`${getProductName(prod)}: ${prod.inStock ? 'In Stock' : 'Out of Stock'}`, '🔄');
        }
      });
    });

    // Edit Product Click
    dom.adminProductList.querySelectorAll('[data-edit-id]').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-edit-id');
        openEditProductModal(id);
      });
    });

    // Delete Product Click
    dom.adminProductList.querySelectorAll('[data-delete-id]').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-delete-id');
        deleteProduct(id);
      });
    });
  }

  function saveProducts() {
    localStorage.setItem('hom_products', JSON.stringify(state.products));
  }

  // --------------------------------------------------------------------------
  // PRODUCT CRUD MODAL (ADD & EDIT)
  // --------------------------------------------------------------------------
  function openAddProductModal() {
    dom.editProductId.value = '';
    dom.editorModalTitle.textContent = 'Add New Product';
    dom.saveProductBtnText.textContent = 'Publish Product';
    dom.editorProdName.value = '';
    dom.editorProdCategory.value = 'kitchen';
    dom.editorProdPrice.value = '';
    dom.editorProdDesc.value = '';
    dom.editorProdInStock.checked = true;

    // Initialize with 1 empty image row
    dom.imageInputsList.innerHTML = '';
    addImageInputRow('public/images/storage1.jpg');

    dom.productEditorBackdrop.classList.add('active');
    dom.productEditorBackdrop.setAttribute('aria-hidden', 'false');
  }

  function openEditProductModal(id) {
    const prod = state.products.find(p => p.id === id);
    if (!prod) return;

    dom.editProductId.value = prod.id;
    dom.editorModalTitle.textContent = 'Edit Product';
    dom.saveProductBtnText.textContent = 'Save Changes';
    dom.editorProdName.value = getProductName(prod);
    dom.editorProdCategory.value = prod.category || 'kitchen';
    dom.editorProdPrice.value = prod.price || '';
    dom.editorProdDesc.value = getProductDesc(prod);
    dom.editorProdInStock.checked = prod.inStock !== false;

    // Load existing images
    dom.imageInputsList.innerHTML = '';
    const images = prod.images && prod.images.length ? prod.images : ['public/images/storage1.jpg'];
    images.forEach(imgUrl => addImageInputRow(imgUrl));

    dom.productEditorBackdrop.classList.add('active');
    dom.productEditorBackdrop.setAttribute('aria-hidden', 'false');
  }

  function closeProductEditorModal() {
    dom.productEditorBackdrop.classList.remove('active');
    dom.productEditorBackdrop.setAttribute('aria-hidden', 'true');
  }

  dom.openAddProductModalBtn.addEventListener('click', openAddProductModal);
  dom.closeEditorBtn.addEventListener('click', closeProductEditorModal);
  dom.cancelEditorBtn.addEventListener('click', closeProductEditorModal);
  dom.productEditorBackdrop.addEventListener('click', (e) => {
    if (e.target === dom.productEditorBackdrop) closeProductEditorModal();
  });

  // Dynamic Multi-Image Row Builder
  function addImageInputRow(url = '') {
    const row = document.createElement('div');
    row.className = 'image-input-row';
    row.innerHTML = `
      <img src="${url || 'public/images/storage1.jpg'}" class="img-preview-thumb" alt="Preview" onerror="this.src='public/images/storage1.jpg'">
      <input type="text" class="form-input prod-img-url-input" placeholder="Image URL or public/images/..." value="${url}" required>
      <button type="button" class="btn-remove-img" title="Remove photo">✕</button>
    `;

    const input = row.querySelector('.prod-img-url-input');
    const thumb = row.querySelector('.img-preview-thumb');
    const removeBtn = row.querySelector('.btn-remove-img');

    input.addEventListener('input', () => {
      thumb.src = input.value.trim() || 'public/images/storage1.jpg';
    });

    removeBtn.addEventListener('click', () => {
      if (dom.imageInputsList.children.length > 1) {
        row.remove();
      } else {
        input.value = '';
        thumb.src = 'public/images/storage1.jpg';
      }
    });

    dom.imageInputsList.appendChild(row);
  }

  dom.btnAddImageRow.addEventListener('click', () => addImageInputRow(''));

  // Quick Presets Click
  document.querySelectorAll('.btn-preset-img').forEach(presetBtn => {
    presetBtn.addEventListener('click', () => {
      const presetUrl = presetBtn.getAttribute('data-preset');
      // Look for first empty row or append new
      const emptyRowInput = Array.from(dom.imageInputsList.querySelectorAll('.prod-img-url-input')).find(inp => !inp.value.trim());
      if (emptyRowInput) {
        emptyRowInput.value = presetUrl;
        const thumb = emptyRowInput.closest('.image-input-row').querySelector('.img-preview-thumb');
        if (thumb) thumb.src = presetUrl;
      } else {
        addImageInputRow(presetUrl);
      }
    });
  });

  // Handle Product Form Submit (Add or Edit)
  dom.productEditorForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const nameVal = dom.editorProdName.value.trim();
    const categoryVal = dom.editorProdCategory.value;
    const priceVal = parseFloat(dom.editorProdPrice.value);
    const descVal = dom.editorProdDesc.value.trim();
    const inStockVal = dom.editorProdInStock.checked;
    const editId = dom.editProductId.value;

    if (!nameVal || isNaN(priceVal) || priceVal <= 0 || !descVal) {
      showToast('Please complete product name, valid price, and description', '⚠️');
      return;
    }

    // Collect all valid image URLs
    const images = Array.from(dom.imageInputsList.querySelectorAll('.prod-img-url-input'))
      .map(inp => inp.value.trim())
      .filter(Boolean);

    if (images.length === 0) {
      images.push('public/images/storage1.jpg');
    }

    if (editId) {
      // EDIT EXISTING PRODUCT
      const prod = state.products.find(p => p.id === editId);
      if (prod) {
        prod.name = { am: nameVal, om: nameVal, en: nameVal };
        prod.category = categoryVal;
        prod.price = priceVal;
        prod.spec = { am: descVal, om: descVal, en: descVal };
        prod.fullDesc = { am: descVal, om: descVal, en: descVal };
        prod.images = images;
        prod.inStock = inStockVal;
        saveProducts();
        showToast(`Updated "${nameVal}" successfully!`, '✓');
      }
    } else {
      // ADD NEW PRODUCT
      const newId = 'prod-' + Date.now();
      const newProd = {
        id: newId,
        category: categoryVal,
        price: priceVal,
        inStock: inStockVal,
        images: images,
        name: { am: nameVal, om: nameVal, en: nameVal },
        spec: { am: descVal, om: descVal, en: descVal },
        fullDesc: { am: descVal, om: descVal, en: descVal },
        badge: { am: "አዲስ", om: "Haaraa", en: "New" }
      };

      state.products.unshift(newProd);
      saveProducts();
      showToast(`Added "${nameVal}" to storefront!`, '🎉');
    }

    closeProductEditorModal();
    renderProducts();
    renderAdminProductList();
  });

  // Delete Product Handler
  function deleteProduct(id) {
    const prod = state.products.find(p => p.id === id);
    const name = prod ? getProductName(prod) : 'this product';

    if (confirm(`Are you sure you want to delete "${name}" from the store catalog?`)) {
      state.products = state.products.filter(p => p.id !== id);
      state.cart = state.cart.filter(item => item.id !== id);
      saveProducts();
      saveCart();
      renderProducts();
      renderAdminProductList();
      updateCartUI();
      showToast(`Deleted "${name}"`, '🗑️');
    }
  }

  // Admin Tab Switch
  dom.adminTabProducts.addEventListener('click', () => {
    dom.adminTabProducts.classList.add('active');
    dom.adminTabOrders.classList.remove('active');
    dom.adminPaneProducts.style.display = 'block';
    dom.adminPaneOrders.style.display = 'none';
  });

  dom.adminTabOrders.addEventListener('click', () => {
    dom.adminTabOrders.classList.add('active');
    dom.adminTabProducts.classList.remove('active');
    dom.adminPaneProducts.style.display = 'none';
    dom.adminPaneOrders.style.display = 'block';
  });

  // ==========================================================================
  // 15. INITIAL BOOTSTRAP
  // ==========================================================================
  initLanguageSystem();
  checkUrlPaymentCallback();

})();
