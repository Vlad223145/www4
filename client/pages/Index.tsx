import { useState, useEffect, useRef } from "react";
import ComprehensiveFAQ from "../components/ComprehensiveFAQ";

interface Droplet {
  id: number;
  x: number;
  startTime: number;
  side: "left" | "right";
}

export default function Index() {
  const [showPopup, setShowPopup] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const carAnimationRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState<{ [key: string]: boolean }>({});
  const [droplets, setDroplets] = useState<Droplet[]>([]);
  const dropletIdRef = useRef(0);
  const [isCardFlipped, setIsCardFlipped] = useState(false);
  const [buttonClicked, setButtonClicked] = useState(false);

  useEffect(() => {
    // Trigger header animation immediately
    setTimeout(() => {
      setIsVisible((prev) => ({ ...prev, header: true }));
    }, 100);

    // Trigger other animations with delays
    setTimeout(() => setIsVisible((prev) => ({ ...prev, hero: true })), 300);
    setTimeout(() => setIsVisible((prev) => ({ ...prev, card: true })), 600);
    setTimeout(() => setIsVisible((prev) => ({ ...prev, button: true })), 900);
    setTimeout(
      () => setIsVisible((prev) => ({ ...prev, journey: true })),
      1200,
    );
    setTimeout(() => setIsVisible((prev) => ({ ...prev, logos: true })), 1500);
  }, []);

  // Constrained droplet generation system - only in upper section
  useEffect(() => {
    const generateDroplet = () => {
      // Only generate in safe zones of upper section, avoiding site content
      const windowWidth = window.innerWidth;

      // Define safe zones that avoid content areas
      const safeAreas = [
        { min: windowWidth * 0.05, max: windowWidth * 0.2 }, // Far left
        { min: windowWidth * 0.8, max: windowWidth * 0.95 }, // Far right
      ];

      // Randomly choose a safe area
      const area = safeAreas[Math.floor(Math.random() * safeAreas.length)];
      const x = Math.random() * (area.max - area.min) + area.min;

      const newDroplet: Droplet = {
        id: dropletIdRef.current++,
        x,
        startTime: Date.now(),
        side: x < windowWidth / 2 ? "left" : "right",
      };

      setDroplets((prev) => [...prev, newDroplet]);

      // Remove droplet after animation completes (3 seconds total)
      setTimeout(() => {
        setDroplets((prev) => prev.filter((d) => d.id !== newDroplet.id));
      }, 3000);
    };

    // Generate first droplet after 1 second
    const initialTimeout = setTimeout(generateDroplet, 1000);

    // Generate droplets every 2-4 seconds
    const interval = setInterval(
      () => {
        generateDroplet();
      },
      Math.random() * 2000 + 2000,
    ); // 2-4 seconds

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (carAnimationRef.current) {
        const rect = carAnimationRef.current.getBoundingClientRect();
        const windowHeight = window.innerHeight;

        // Calculate progress when animation section is in view
        if (rect.top < windowHeight && rect.bottom > 0) {
          // More precise calculation: car starts moving when section enters viewport
          // and completes journey when section exits viewport
          const sectionTop = rect.top;
          const sectionHeight = rect.height;

          let progress = 0;
          if (sectionTop <= windowHeight) {
            // Calculate how much of the section has passed through the viewport
            const travelled = windowHeight - sectionTop;
            const totalDistance = windowHeight + sectionHeight;
            progress = Math.min(Math.max(travelled / totalDistance, 0), 1);
          }

          setScrollProgress(progress);
        } else if (rect.bottom <= 0) {
          // Section has passed completely, car should be at end
          setScrollProgress(1);
        } else {
          // Section hasn't entered viewport yet, car at start
          setScrollProgress(0);
        }
      }

      // Scroll-triggered animations
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;

      if (scrollY > windowHeight * 0.3)
        setIsVisible((prev) => ({ ...prev, features: true }));
      if (scrollY > windowHeight * 0.6)
        setIsVisible((prev) => ({ ...prev, howItWorks: true }));
      if (scrollY > windowHeight * 0.9)
        setIsVisible((prev) => ({ ...prev, stats: true }));
      if (scrollY > windowHeight * 1.2)
        setIsVisible((prev) => ({ ...prev, testimonials: true }));
      if (scrollY > windowHeight * 1.5)
        setIsVisible((prev) => ({ ...prev, faq: true }));
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const getCarPosition = (progress: number) => {
    // Ensure progress is between 0 and 1
    const t = Math.max(0, Math.min(1, progress));

    // Path: M50 150 Q200 50, 400 100 T750 120
    // This represents: Start(50,150) -> Control(200,50) -> Middle(400,100) -> End(750,120)

    if (t <= 0.5) {
      // First quadratic curve: from (50,150) through (200,50) to (400,100)
      const localT = t * 2; // Scale to 0-1 for first curve
      const x =
        Math.pow(1 - localT, 2) * 50 +
        2 * (1 - localT) * localT * 200 +
        Math.pow(localT, 2) * 400;
      const y =
        Math.pow(1 - localT, 2) * 150 +
        2 * (1 - localT) * localT * 50 +
        Math.pow(localT, 2) * 100;
      return { x, y };
    } else {
      // Second quadratic curve: from (400,100) through (575,110) to (750,120)
      const localT = (t - 0.5) * 2; // Scale to 0-1 for second curve
      const x =
        Math.pow(1 - localT, 2) * 400 +
        2 * (1 - localT) * localT * 575 +
        Math.pow(localT, 2) * 750;
      const y =
        Math.pow(1 - localT, 2) * 100 +
        2 * (1 - localT) * localT * 110 +
        Math.pow(localT, 2) * 120;
      return { x, y };
    }
  };

  // Get car position, defaulting to start position when no scroll progress
  const carPosition =
    scrollProgress > 0 ? getCarPosition(scrollProgress) : { x: 50, y: 150 };

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqs = [
    {
      question: "How does fuellfit save me money on fuel?",
      answer:
        "fuellfit partners directly with gas stations across Europe to negotiate exclusive discount rates. Our AI technology analyzes real-time fuel prices and automatically applies the best available discount at each location. You save an average of 12% per fill-up through our network of 15,000+ partner stations.",
    },
    {
      question: "What payment methods can I link to my account?",
      answer:
        "You can securely link any major debit or credit card (Visa, Mastercard, American Express) issued by European banks. We also support digital wallets like Apple Pay and Google Pay. All payment data is encrypted with bank-level security and stored in compliance with EU regulations.",
    },
    {
      question: "Where can I use fuellfit across Europe?",
      answer:
        "fuellfit works at over 15,000 gas stations across 30 European countries including all EU member states, UK, Norway, Switzerland, and Iceland. Our network includes major brands like Shell, BP, Total, Esso, and hundreds of independent stations. Use our built-in map to find the nearest partner location.",
    },
    {
      question: "When will I receive my €15 welcome bonus?",
      answer:
        "Your €15 bonus is credited instantly to your fuellfit account after linking your payment method and completing your first fuel purchase of €20 or more. The bonus can be used immediately for your next fill-up and never expires. There are no hidden fees or subscription costs.",
    },
    {
      question: "Who can use fuellfit and what if I travel frequently?",
      answer:
        "fuellfit is perfect for anyone who drives in Europe - from daily commuters to long-distance travelers, families, and commercial fleet operators. If you travel frequently, you'll love our cross-border compatibility and unified pricing. The app automatically detects your location and applies local discounts wherever you are.",
    },
  ];

  return (
    <div className="min-h-screen bg-white text-black relative overflow-hidden">
      {/* Constrained Animated Droplets - only in upper section */}
      <div
        className="absolute inset-0 pointer-events-none overflow-hidden"
        style={{ height: "120vh" }}
      >
        {droplets.map((droplet) => (
          <div
            key={droplet.id}
            className="absolute pointer-events-none z-10"
            style={{
              left: `${droplet.x}px`,
              top: "20px",
            }}
          >
            {/* Rounded Thick Droplet Shape */}
            <div className="animate-droplet-fall">
              <div className="relative">
                <div
                  className="bg-black animate-droplet-form"
                  style={{
                    width: "20px",
                    height: "30px",
                    borderRadius: "50% 50% 50% 50% / 40% 40% 60% 60%",
                    transform: "scale(0)",
                  }}
                ></div>
              </div>
            </div>

            {/* Simplified puddle that appears quickly and fades */}
            <div
              className="absolute left-1/2 transform -translate-x-1/2 animate-puddle-form"
              style={{ top: "400px" }}
            >
              <div
                className="bg-black opacity-0 animate-puddle-appear"
                style={{
                  width: "32px",
                  height: "8px",
                  borderRadius: "50% 40% 60% 50%",
                }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      {/* Comprehensive FAQ in top left corner */}
      <ComprehensiveFAQ />

      {/* Fixed Corner Connect Button */}
      <button
        onClick={() => setShowPopup(true)}
        className="fixed top-6 right-6 bg-black text-white px-6 py-3 rounded-full font-bold hover:bg-gray-800 transition-all transform hover:scale-105 z-50 shadow-lg"
      >
        Connect Card
      </button>

      {/* Header */}
      <header
        className={`px-6 py-8 text-center transition-all duration-1000 ${isVisible.header ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-10"}`}
      >
        <h1 className="text-4xl font-black tracking-tight text-black">
          fuellfit
        </h1>
        <p className="text-sm text-gray-600 mt-2">
          Europe's #1 Fuel Savings App
        </p>
      </header>

      {/* Main Content */}
      <main className="px-6 space-y-20">
        {/* Hero Section */}
        <div
          className={`text-center space-y-6 transition-all duration-1000 delay-300 ${isVisible.hero ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          <h2 className="text-6xl font-black leading-tight text-black max-w-4xl mx-auto">
            Get €15 for linking your card
          </h2>

          <p className="text-2xl font-semibold text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Revolutionary fuel savings technology that automatically applies
            discounts at over 15,000 gas stations across Europe. Join millions
            of drivers who save hundreds of euros every year with our
            intelligent payment system.
          </p>
        </div>

        {/* Interactive Card Section with Flip Animation */}
        <div
          className={`flex justify-center transition-all duration-1000 delay-600 ${isVisible.card ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          <div className="relative perspective-1000">
            <div
              className={`w-80 h-48 transition-transform duration-700 transform-style-preserve-3d cursor-pointer ${isCardFlipped ? "rotate-y-180" : ""}`}
              onClick={() => setIsCardFlipped(!isCardFlipped)}
              onMouseEnter={() =>
                window.innerWidth > 768 && setIsCardFlipped(true)
              }
              onMouseLeave={() =>
                window.innerWidth > 768 && setIsCardFlipped(false)
              }
            >
              {/* Front Side */}
              <div className="absolute inset-0 bg-black rounded-2xl shadow-2xl p-6 flex flex-col justify-between backface-hidden">
                <div className="flex justify-between items-start">
                  <div className="text-white text-sm font-medium">fuellfit</div>
                  <div className="text-white text-2xl">CARD</div>
                </div>
                <div className="text-center">
                  <div className="text-white text-6xl font-black tracking-wide">
                    €15
                  </div>
                  <div className="text-white text-sm opacity-60 mt-1">
                    Welcome Bonus
                  </div>
                </div>
                <div className="text-white text-sm opacity-80">
                  Fuel Discount Card • Premium Member
                </div>
              </div>

              {/* Back Side */}
              <div className="absolute inset-0 bg-black rounded-2xl shadow-2xl p-4 flex flex-col justify-center backface-hidden rotate-y-180">
                <div className="text-center mb-4">
                  <div className="text-white text-sm font-medium mb-1">
                    fuellfit
                  </div>
                  <h3 className="text-white text-base font-bold mb-3">
                    Bonus Terms
                  </h3>
                </div>

                <div className="text-white space-y-2 text-xs leading-tight">
                  <div className="flex items-start space-x-2">
                    <span className="text-green-400 text-sm">•</span>
                    <span>Use at any partner station across Europe</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="text-green-400 text-sm">•</span>
                    <span>One-time bonus per bank card registration</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="text-green-400 text-sm">•</span>
                    <span>See FAQ for complete details</span>
                  </div>
                </div>

                <div className="text-white text-xs opacity-60 text-center mt-4">
                  Tap to flip back
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Get €15 Button - Moved under card with distance */}
        <div
          className={`text-center transition-all duration-1000 delay-900 ${isVisible.button ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          <button
            onClick={() => {
              setButtonClicked(true);
              setTimeout(() => setButtonClicked(false), 2000);
              setShowPopup(true);
            }}
            className={`text-white text-xl font-bold py-4 px-12 rounded-xl shadow-lg transition-all transform hover:scale-105 ${
              buttonClicked
                ? "bg-green-500 hover:bg-green-600"
                : "bg-black hover:bg-gray-800"
            }`}
          >
            Get Your €15 Welcome Bonus
          </button>
        </div>

        {/* Car Journey Animation - Moved below button, white background, dark elements */}
        <div
          ref={carAnimationRef}
          className={`max-w-4xl mx-auto bg-white rounded-3xl p-8 overflow-hidden transition-all duration-1000 delay-1200 ${isVisible.journey ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          <h3 className="text-2xl font-bold text-center mb-8 text-black">
            Your Journey to Savings
          </h3>
          <div className="relative h-64 w-full">
            <svg className="w-full h-full" viewBox="0 0 800 200">
              {/* Dark curved road path */}
              <path
                d="M50 150 Q200 50, 400 100 T750 120"
                stroke="#1f2937"
                strokeWidth="8"
                fill="none"
              />

              {/* White road markings */}
              <path
                d="M50 150 Q200 50, 400 100 T750 120"
                stroke="#ffffff"
                strokeWidth="2"
                fill="none"
                strokeDasharray="20 20"
                className="animate-road-markings"
              />

              {/* Dark starting point A */}
              <circle cx="50" cy="150" r="12" fill="#1f2937" />
              <text
                x="50"
                y="150"
                textAnchor="middle"
                dy="4"
                className="text-white text-sm font-bold"
              >
                A
              </text>
              <text
                x="50"
                y="180"
                textAnchor="middle"
                className="text-sm font-semibold fill-black"
              >
                Your Location
              </text>

              {/* Dark Gas Station */}
              <g
                className="animate-station-appear"
                style={{ animationDelay: "2s" }}
              >
                <rect
                  x="720"
                  y="70"
                  width="45"
                  height="70"
                  fill="#1f2937"
                  rx="8"
                />
                <rect
                  x="725"
                  y="75"
                  width="35"
                  height="25"
                  fill="#374151"
                  rx="3"
                  stroke="#1f2937"
                  strokeWidth="1"
                />
                <rect
                  x="765"
                  y="85"
                  width="15"
                  height="40"
                  fill="#1f2937"
                  rx="3"
                />
                <path
                  d="M773 125 Q778 130, 775 140 L770 145"
                  stroke="#374151"
                  strokeWidth="3"
                  fill="none"
                  strokeLinecap="round"
                />
                <ellipse cx="770" cy="147" rx="3" ry="2" fill="#374151" />
                <rect
                  x="715"
                  y="140"
                  width="55"
                  height="8"
                  fill="#1f2937"
                  rx="2"
                />
                <circle cx="730" cy="110" r="2" fill="#ef4444" />
                <circle cx="740" cy="110" r="2" fill="#22c55e" />
                <circle cx="750" cy="110" r="2" fill="#3b82f6" />
                <text
                  x="747"
                  y="165"
                  textAnchor="middle"
                  className="text-sm font-semibold fill-black"
                >
                  Gas Station
                </text>
              </g>

              {/* Simple Black Car - precisely positioned on road */}
              <g transform={`translate(${carPosition.x}, ${carPosition.y})`}>
                {/* Center the car on the road line */}
                <g transform="translate(-20, -16)">
                  <path
                    d="M8 20 C8 18, 10 16, 12 16 L32 16 C34 16, 36 18, 36 20 L36 22 C38 22, 40 24, 40 26 L40 30 C40 32, 38 34, 36 34 L34 34 C34 36, 32 38, 30 38 L28 38 C26 38, 24 36, 24 34 L16 34 C16 36, 14 38, 12 38 L10 38 C8 38, 6 36, 6 34 L4 34 C2 34, 0 32, 0 30 L0 26 C0 24, 2 22, 4 22 L4 20 Z"
                    fill="#1f2937"
                  />
                  <rect
                    x="8"
                    y="18"
                    width="10"
                    height="8"
                    fill="#374151"
                    rx="2"
                  />
                  <rect
                    x="22"
                    y="18"
                    width="10"
                    height="8"
                    fill="#374151"
                    rx="2"
                  />
                  <circle
                    cx="10"
                    cy="34"
                    r="4"
                    fill="#1f2937"
                    stroke="#374151"
                    strokeWidth="1"
                  />
                  <circle
                    cx="30"
                    cy="34"
                    r="4"
                    fill="#1f2937"
                    stroke="#374151"
                    strokeWidth="1"
                  />
                  <circle cx="10" cy="34" r="2" fill="#374151" />
                  <circle cx="30" cy="34" r="2" fill="#374151" />
                </g>
              </g>
            </svg>
          </div>
          <p className="text-center text-gray-600 mt-4">
            Scroll down to watch your car journey to the gas station and start
            saving!
          </p>
        </div>

        {/* Real Gas Station Logos Strip - No Text */}
        <div
          className={`overflow-hidden py-8 transition-all duration-1000 delay-1500 ${isVisible.logos ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          <div className="relative">
            <div className="flex animate-scroll-seamless space-x-16 whitespace-nowrap">
              {/* Multiple repetitions for perfect seamlessness */}
              {Array.from({ length: 8 }).map((_, setIndex) => (
                <div
                  key={setIndex}
                  className="flex space-x-16 min-w-max items-center"
                >
                  {/* Shell */}
                  <img
                    src="https://cdn.builder.io/api/v1/image/assets%2F86f4e443f35a4609b52c42bedac1a4c2%2F21211a00521446d5a2cfd226b2fbf123?format=webp&width=800"
                    alt="Shell"
                    className="h-16 w-auto object-contain"
                  />

                  {/* BP */}
                  <img
                    src="https://cdn.builder.io/api/v1/image/assets%2F86f4e443f35a4609b52c42bedac1a4c2%2F8bff8b72abfe4383bdcffbbdaf194c60?format=webp&width=800"
                    alt="BP"
                    className="h-16 w-auto object-contain"
                  />

                  {/* TotalEnergies */}
                  <img
                    src="https://cdn.builder.io/api/v1/image/assets%2F86f4e443f35a4609b52c42bedac1a4c2%2Fdebf3f2a92ba4f95a044fb20a1cf85ae?format=webp&width=800"
                    alt="TotalEnergies"
                    className="h-16 w-auto object-contain"
                  />

                  {/* Esso */}
                  <img
                    src="https://cdn.builder.io/api/v1/image/assets%2F86f4e443f35a4609b52c42bedac1a4c2%2F95b81c91c9794773bb96fd5a918c0846?format=webp&width=800"
                    alt="Esso"
                    className="h-16 w-auto object-contain"
                  />

                  {/* Repsol */}
                  <img
                    src="https://cdn.builder.io/api/v1/image/assets%2F86f4e443f35a4609b52c42bedac1a4c2%2F979cc08eb8ca413e93b9137860445d84?format=webp&width=800"
                    alt="Repsol"
                    className="h-16 w-auto object-contain"
                  />

                  {/* ENI */}
                  <img
                    src="https://cdn.builder.io/api/v1/image/assets%2F86f4e443f35a4609b52c42bedac1a4c2%2F7710f08a3e7241cca5e04d5608598cb3?format=webp&width=800"
                    alt="ENI"
                    className="h-16 w-auto object-contain"
                  />

                  {/* ARAL */}
                  <img
                    src="https://cdn.builder.io/api/v1/image/assets%2F86f4e443f35a4609b52c42bedac1a4c2%2F1085a246fb9945f6a8019e7704c3f2fa?format=webp&width=800"
                    alt="ARAL"
                    className="h-16 w-auto object-contain"
                  />

                  {/* OMV */}
                  <img
                    src="https://cdn.builder.io/api/v1/image/assets%2F86f4e443f35a4609b52c42bedac1a4c2%2F8772882d7d92415e9fb5ac419af8ccd4?format=webp&width=800"
                    alt="OMV"
                    className="h-16 w-auto object-contain"
                  />

                  {/* ORLEN */}
                  <img
                    src="https://cdn.builder.io/api/v1/image/assets%2F86f4e443f35a4609b52c42bedac1a4c2%2F81c5d46d062a4788a968c8580c4a3596?format=webp&width=800"
                    alt="ORLEN"
                    className="h-16 w-auto object-contain"
                  />

                  {/* MOL */}
                  <img
                    src="https://cdn.builder.io/api/v1/image/assets%2F86f4e443f35a4609b52c42bedac1a4c2%2F574318b47f0547edac4bb168276116fb?format=webp&width=800"
                    alt="MOL"
                    className="h-16 w-auto object-contain"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* How to Use Your €15 Bonus */}
        <div
          className={`max-w-6xl mx-auto transition-all duration-1000 ${isVisible.features ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"}`}
        >
          <div className="text-center mb-16">
            <h3 className="text-4xl font-black mb-4">
              Spend Your €15 Anywhere in Europe
            </h3>
            <p className="text-xl text-gray-600">
              Use your bonus at over 15,000 partner stations across 30 countries
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-lg">€15</span>
                </div>
                <div>
                  <h4 className="text-xl font-bold mb-2">
                    Universal Partner Coverage
                  </h4>
                  <p className="text-gray-600">
                    Your €15 bonus works at any fuellfit partner station from
                    Portugal to Poland, Norway to Italy.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center flex-shrink-0">
                  <div className="w-6 h-6 bg-white rounded border border-gray-300 flex items-center justify-center">
                    <div className="w-4 h-4 bg-black rounded-sm"></div>
                  </div>
                </div>
                <div>
                  <h4 className="text-xl font-bold mb-2">
                    Simple QR Code Payment
                  </h4>
                  <p className="text-gray-600">
                    Just show your unique QR code to the cashier. No cards
                    needed, no complicated setup, instant discount applied.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold">⚡</span>
                </div>
                <div>
                  <h4 className="text-xl font-bold mb-2">
                    Instant Recognition
                  </h4>
                  <p className="text-gray-600">
                    All partner stations recognize fuellfit QR codes
                    immediately. No registration or setup required at the pump.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold">🌍</span>
                </div>
                <div>
                  <h4 className="text-xl font-bold mb-2">
                    Cross-Border Flexibility
                  </h4>
                  <p className="text-gray-600">
                    Drive from Berlin to Barcelona? Your €15 travels with you
                    and works at stations in every country you visit.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold">📱</span>
                </div>
                <div>
                  <h4 className="text-xl font-bold mb-2">Works Offline Too</h4>
                  <p className="text-gray-600">
                    Your QR code works even without internet connection. Perfect
                    for remote areas or travel through different networks.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold">💎</span>
                </div>
                <div>
                  <h4 className="text-xl font-bold mb-2">
                    Stack with Station Discounts
                  </h4>
                  <p className="text-gray-600">
                    Your €15 bonus combines with existing station promotions,
                    loyalty discounts, and fuel card benefits for maximum
                    savings.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* QR Code Demo Section */}
          <div className="mt-16 bg-gray-50 rounded-3xl p-8 text-center">
            <h4 className="text-2xl font-bold mb-6">
              How It Works at the Station
            </h4>
            <div className="flex items-center justify-center space-x-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="w-20 h-20 bg-white border-2 border-gray-300 rounded-xl flex items-center justify-center mb-4 mx-auto">
                  <div className="w-16 h-16 bg-black rounded-lg flex items-center justify-center">
                    <div className="grid grid-cols-3 gap-1">
                      {[...Array(9)].map((_, i) => (
                        <div
                          key={i}
                          className={`w-1 h-1 ${Math.random() > 0.5 ? "bg-white" : "bg-transparent"}`}
                        ></div>
                      ))}
                    </div>
                  </div>
                </div>
                <p className="font-semibold">1. Show QR Code</p>
              </div>

              <div className="text-4xl text-gray-400">→</div>

              <div className="text-center">
                <div className="w-20 h-20 bg-green-100 border-2 border-green-300 rounded-xl flex items-center justify-center mb-4 mx-auto">
                  <span className="text-green-600 text-2xl font-bold">✓</span>
                </div>
                <p className="font-semibold">2. Instant Scan</p>
              </div>

              <div className="text-4xl text-gray-400">→</div>

              <div className="text-center">
                <div className="w-20 h-20 bg-blue-100 border-2 border-blue-300 rounded-xl flex items-center justify-center mb-4 mx-auto">
                  <span className="text-blue-600 text-xl font-bold">€15</span>
                </div>
                <p className="font-semibold">3. Discount Applied</p>
              </div>
            </div>
          </div>
        </div>

        {/* How It Works Section */}
        <div
          className={`bg-gray-50 rounded-3xl p-8 max-w-6xl mx-auto transition-all duration-1000 ${isVisible.howItWorks ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"}`}
        >
          <h3 className="text-3xl font-black text-center mb-12">
            How fuellfit Works
          </h3>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center space-y-4">
              <div className="w-20 h-20 bg-black text-white rounded-full flex items-center justify-center mx-auto text-2xl font-bold">
                1
              </div>
              <h4 className="text-lg font-bold">Download & Register</h4>
              <p className="text-sm text-gray-600">
                Create your account in under 2 minutes with bank-grade security
                verification
              </p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-20 h-20 bg-black text-white rounded-full flex items-center justify-center mx-auto text-2xl font-bold">
                2
              </div>
              <h4 className="text-lg font-bold">Link Payment Method</h4>
              <p className="text-sm text-gray-600">
                Securely connect your preferred debit or credit card with
                256-bit encryption
              </p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-20 h-20 bg-black text-white rounded-full flex items-center justify-center mx-auto text-2xl font-bold">
                3
              </div>
              <h4 className="text-lg font-bold">Find Stations</h4>
              <p className="text-sm text-gray-600">
                Use GPS navigation to locate the nearest partner stations with
                live pricing
              </p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-20 h-20 bg-black text-white rounded-full flex items-center justify-center mx-auto text-2xl font-bold">
                4
              </div>
              <h4 className="text-lg font-bold">Fuel & Save</h4>
              <p className="text-sm text-gray-600">
                Tap your phone at the pump and watch automatic discounts apply
                instantly
              </p>
            </div>
          </div>
        </div>

        {/* Enhanced Stats Section */}
        <div
          className={`bg-black text-white rounded-3xl p-8 max-w-4xl mx-auto transition-all duration-1000 ${isVisible.stats ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"}`}
        >
          <h3 className="text-2xl font-bold text-center mb-8">
            fuellfit Impact
          </h3>
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-black">2.5M+</div>
              <div className="text-sm opacity-80">Active Users</div>
              <div className="text-xs opacity-60 mt-1">
                Growing by 50k monthly
              </div>
            </div>
            <div>
              <div className="text-4xl font-black">15.2k</div>
              <div className="text-sm opacity-80">Partner Stations</div>
              <div className="text-xs opacity-60 mt-1">Across 30 countries</div>
            </div>
            <div>
              <div className="text-4xl font-black">€45M</div>
              <div className="text-sm opacity-80">Total Savings</div>
              <div className="text-xs opacity-60 mt-1">Since 2019 launch</div>
            </div>
            <div>
              <div className="text-4xl font-black">12%</div>
              <div className="text-sm opacity-80">Average Savings</div>
              <div className="text-xs opacity-60 mt-1">Per fuel purchase</div>
            </div>
          </div>
        </div>

        {/* Enhanced Testimonials with Golden Stars */}
        <div
          className={`max-w-6xl mx-auto space-y-8 transition-all duration-1000 ${isVisible.testimonials ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"}`}
        >
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 mb-8">
            <div className="text-center space-y-4">
              <h3 className="text-3xl font-black">Trusted by Millions</h3>
              <div className="flex justify-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className="w-8 h-8 text-yellow-400 fill-current animate-star-glow"
                    style={{ animationDelay: `${i * 0.1}s` }}
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                ))}
              </div>
            </div>

            {/* TrustPoint Badge */}
            <a
              href="https://framer.link/drukarov"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-2 bg-white p-4 rounded-xl shadow-lg border hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center gap-1">
                <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                  <svg
                    viewBox="0 0 27 26"
                    className="w-5 h-5 text-white fill-current"
                  >
                    <path d="M26.621 9.589l-16.456 13.316 0-10.165 9.579-8.233 15.51-5.083 25.089-19.167 21.539-18.399 z" />
                  </svg>
                </div>
                <span className="font-bold text-lg text-gray-900">
                  TrustPoint
                </span>
              </div>

              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="w-6 h-6 bg-green-500 rounded flex items-center justify-center"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      className="w-4 h-4 text-white fill-current"
                    >
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  </div>
                ))}
              </div>

              <p className="text-sm text-gray-700 font-medium">
                <strong className="font-extrabold">Excellent 4.9</strong> out of
                5
              </p>
            </a>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-lg border">
              <p className="text-gray-700 mb-4">
                "Saved €400 this year alone! The app finds the cheapest stations
                automatically and the payments are so smooth."
              </p>
              <div className="font-semibold">Maria K., Berlin</div>
              <div className="text-sm text-gray-500">
                Premium Member since 2022
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-lg border">
              <p className="text-gray-700 mb-4">
                "As a truck driver crossing Europe weekly, fuellfit has become
                essential. Works perfectly everywhere."
              </p>
              <div className="font-semibold">Jean P., Paris</div>
              <div className="text-sm text-gray-500">
                Commercial Fleet Manager
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-lg border">
              <p className="text-gray-700 mb-4">
                "The instant discounts are real! No gimmicks, just genuine
                savings every time I fill up."
              </p>
              <div className="font-semibold">Anders L., Stockholm</div>
              <div className="text-sm text-gray-500">Family Account Holder</div>
            </div>
          </div>
        </div>

        {/* Enhanced FAQ Section */}
        <div
          className={`max-w-4xl mx-auto space-y-8 transition-all duration-1000 ${isVisible.faq ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"}`}
        >
          <h3 className="text-3xl font-black text-center">
            Frequently Asked Questions
          </h3>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-2xl overflow-hidden bg-white shadow-sm"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full px-6 py-4 text-left hover:bg-gray-50 transition-all duration-300 flex justify-between items-center group"
                >
                  <span className="text-lg font-semibold text-gray-900 group-hover:text-black transition-colors">
                    {faq.question}
                  </span>
                  <span
                    className={`text-2xl font-bold transition-all duration-300 transform ${
                      openFaq === index
                        ? "rotate-45 text-gray-600"
                        : "rotate-0 text-gray-400 group-hover:text-gray-600"
                    }`}
                  >
                    +
                  </span>
                </button>
                <div
                  className={`overflow-hidden transition-all duration-500 ease-in-out ${
                    openFaq === index
                      ? "max-h-96 opacity-100"
                      : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                    <p className="text-gray-700 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Enhanced Popup Modal */}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-md w-full max-h-[90vh] overflow-y-auto relative animate-bounce-in">
            <button
              onClick={() => setShowPopup(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-black text-2xl font-bold"
            >
              ×
            </button>

            <div className="p-8 space-y-8">
              <h3 className="text-3xl font-black text-center text-black">
                Claim Your €15 Bonus
              </h3>

              <div className="relative bg-gradient-to-b from-blue-400 to-green-400 rounded-2xl p-6 h-48 overflow-hidden">
                <div className="flex justify-around items-end h-full">
                  <div className="animate-pump-1">
                    <div className="w-8 h-20 bg-gray-800 rounded-t-lg relative">
                      <div className="w-6 h-6 bg-red-500 rounded-full absolute -top-2 left-1 animate-pulse"></div>
                      <div className="w-1 h-8 bg-black absolute top-6 left-3 animate-fuel-flow"></div>
                    </div>
                    <div className="w-12 h-4 bg-gray-600 rounded-b-lg -mt-1"></div>
                  </div>

                  <div className="animate-pump-2 animation-delay-1000">
                    <div className="w-8 h-20 bg-gray-800 rounded-t-lg relative">
                      <div className="w-6 h-6 bg-green-500 rounded-full absolute -top-2 left-1 animate-pulse"></div>
                      <div className="w-1 h-8 bg-black absolute top-6 left-3 animate-fuel-flow"></div>
                    </div>
                    <div className="w-12 h-4 bg-gray-600 rounded-b-lg -mt-1"></div>
                  </div>

                  <div className="animate-pump-3 animation-delay-2000">
                    <div className="w-8 h-20 bg-gray-800 rounded-t-lg relative">
                      <div className="w-6 h-6 bg-blue-500 rounded-full absolute -top-2 left-1 animate-pulse"></div>
                      <div className="w-1 h-8 bg-black absolute top-6 left-3 animate-fuel-flow"></div>
                    </div>
                    <div className="w-12 h-4 bg-gray-600 rounded-b-lg -mt-1"></div>
                  </div>
                </div>

                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                  <div className="flex space-x-2">
                    <div className="w-2 h-8 bg-black rounded-full animate-swing-1"></div>
                    <div className="w-2 h-8 bg-black rounded-full animate-swing-2"></div>
                    <div className="w-2 h-8 bg-black rounded-full animate-swing-3"></div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0">
                    1
                  </div>
                  <div>
                    <h4 className="text-xl font-bold mb-2">
                      Link Your Bank Card
                    </h4>
                    <p className="text-gray-600">
                      Connect any debit or credit card to the fuellfit app for
                      automatic payments at gas stations across Europe. Your
                      card details are protected with military-grade encryption.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0">
                    2
                  </div>
                  <div>
                    <h4 className="text-xl font-bold mb-2">
                      Receive €15 Bonus
                    </h4>
                    <p className="text-gray-600">
                      Get €15 instantly credited to your fuellfit account after
                      successful card verification and your first fuel purchase
                      of €20 or more.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0">
                    3
                  </div>
                  <div>
                    <h4 className="text-xl font-bold mb-2">
                      Start Saving Immediately
                    </h4>
                    <p className="text-gray-600">
                      Use the app at any of our 15,000+ partner stations to get
                      instant discounts, earn cashback rewards, and track your
                      total savings over time.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="bg-green-50 p-4 rounded-xl border border-green-200">
                  <div className="flex items-center space-x-2 text-green-700">
                    <span className="text-lg">SECURE</span>
                    <span className="font-semibold">
                      Bank-level security & EU data protection
                    </span>
                  </div>
                </div>
                <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
                  <div className="flex items-center space-x-2 text-blue-700">
                    <span className="text-lg">TRUSTED</span>
                    <span className="font-semibold">
                      2.5M+ users across Europe
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-center pt-4">
                <button className="bg-black text-white text-lg font-bold py-3 px-8 rounded-xl w-full hover:bg-gray-800 transition-colors">
                  Link Card & Get €15 Now
                </button>
                <p className="text-xs text-gray-500 mt-2">
                  No subscription fees • Cancel anytime • EU regulated
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
