import { useState } from "react";
import { X, ChevronDown, ChevronUp } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

const comprehensiveFAQs: FAQItem[] = [
  {
    question: "What exactly is the €15 welcome bonus and how does it work?",
    answer: "The €15 welcome bonus is a one-time credit automatically added to your fuellfit account after you successfully link a valid European bank card and complete your first fuel purchase of €20 or more at any partner station. This bonus can be used immediately for future fuel purchases and combines with ongoing discounts. The bonus never expires and has no hidden fees or subscription requirements attached."
  },
  {
    question: "Which payment methods and bank cards are accepted for the bonus?",
    answer: "We accept all major debit and credit cards including Visa, Mastercard, and American Express issued by European banks. Digital wallets like Apple Pay, Google Pay, and Samsung Pay are also supported. Your card must be from a European financial institution and have sufficient funds for the initial €20 minimum purchase. All payment data is encrypted with 256-bit SSL and stored in compliance with PCI-DSS and GDPR regulations."
  },
  {
    question: "At which gas stations can I use fuellfit and earn the bonus?",
    answer: "fuellfit works at over 15,200 partner stations across 30 European countries including all EU member states, UK, Norway, Switzerland, and Iceland. Our network includes major international brands like Shell, BP, TotalEnergies, Esso, Repsol, ENI, ARAL, OMV, ORLEN, MOL, plus hundreds of independent local stations. Use our built-in GPS map feature to find the nearest partner location with real-time fuel prices and available discounts."
  },
  {
    question: "How quickly will I receive my €15 bonus after linking my card?",
    answer: "Your €15 bonus is credited instantly to your fuellfit wallet immediately after you complete your first qualifying fuel purchase of €20 or more. The process typically takes less than 30 seconds from transaction completion. You'll receive a push notification confirming the bonus credit, and the funds become available for use at your very next fuel stop with no waiting period."
  },
  {
    question: "Are there any restrictions on how I can spend my €15 bonus?",
    answer: "The €15 bonus can be used exactly like cash at any fuellfit partner station across Europe. There are no restrictions on fuel type (petrol, diesel, premium grades), no minimum purchase requirements for bonus usage, and no expiration date. The bonus can be combined with station promotions, loyalty discounts, and other fuellfit savings. You can spend it all at once or use portions across multiple fill-ups."
  },
  {
    question: "Can I get multiple €15 bonuses by linking different cards?",
    answer: "The €15 welcome bonus is limited to one per user account, regardless of how many cards you link. However, you can link up to 5 different payment methods to your account for convenience. Each additional card enjoys the same discount rates and cashback benefits, making it easy to choose your preferred payment method at the pump while maintaining all the savings advantages."
  },
  {
    question: "What ongoing savings can I expect after using my €15 bonus?",
    answer: "After your welcome bonus, fuellfit continues to save you money through several mechanisms: automatic discounts averaging 8-15% at partner stations, exclusive member-only promotions, cashback rewards on every purchase, and real-time price comparison to help you find the cheapest nearby options. Our users typically save €300-500 annually on fuel costs through these ongoing benefits."
  },
  {
    question: "How does the fuellfit payment system work at gas stations?",
    answer: "Simply open the fuellfit app, select your preferred payment method, and either scan the QR code at the pump or show your unique payment QR code to the cashier. The system automatically applies all available discounts, processes payment through your linked card, and sends a digital receipt to your app. The entire process takes under 60 seconds and works even in areas with poor internet connectivity."
  },
  {
    question: "Is my payment and personal data secure with fuellfit?",
    answer: "Absolutely. fuellfit uses bank-level security with 256-bit SSL encryption, two-factor authentication, and biometric login options. We're fully compliant with GDPR, PCI-DSS standards, and are registered with European financial authorities. Your actual card numbers are never stored on our servers - we use tokenized payment processing. All data is hosted on EU-based servers with regular third-party security audits."
  },
  {
    question: "Can I use fuellfit while traveling across different European countries?",
    answer: "Yes! fuellfit works seamlessly across all 30 European countries in our network. The app automatically detects your location and applies local discounts and currency conversions. Your €15 bonus and ongoing savings work at partner stations from Portugal to Poland, Norway to Italy. Cross-border transactions are processed instantly with competitive exchange rates and no additional fees."
  },
  {
    question: "What happens if I have technical issues or need customer support?",
    answer: "Our multilingual customer support team is available 24/7 through in-app chat, email, and phone support in 12 European languages. For technical issues during fueling, we offer instant transaction reversal and emergency payment alternatives. All support tickets are resolved within 4 hours, with most issues fixed in under 1 hour. We also provide comprehensive help guides and video tutorials within the app."
  },
  {
    question: "Are there any subscription fees or hidden costs with fuellfit?",
    answer: "fuellfit is completely free to download and use. There are no monthly subscription fees, no membership costs, no transaction fees, and no hidden charges. The only money that leaves your account is for the actual fuel you purchase, minus the discounts we provide. Our revenue comes from partnerships with gas stations, allowing us to pass 100% of negotiated savings directly to users."
  },
  {
    question: "How does fuellfit compare to other fuel discount apps and cards?",
    answer: "fuellfit offers the largest European network (15,200+ stations vs. competitors' 3,000-8,000), higher average savings (12% vs. 3-7%), instant payment processing, and no subscription fees. Unlike traditional fuel cards that work only with specific brands, fuellfit partners with all major networks. We also provide real-time price comparison, cashback rewards, and cross-border functionality that most competitors lack."
  },
  {
    question: "Can businesses and fleet operators use fuellfit for commercial vehicles?",
    answer: "Yes! fuellfit offers specialized business accounts for companies, fleet operators, and commercial drivers. Business features include centralized billing, detailed expense reporting, employee spending controls, bulk discount rates, and integration with popular fleet management systems. Commercial users still receive the €15 welcome bonus per driver account, plus additional volume-based discounts for fleets over 10 vehicles."
  },
  {
    question: "What environmental and sustainability initiatives does fuellfit support?",
    answer: "fuellfit promotes eco-friendly driving through route optimization to reduce unnecessary trips, partnerships with stations offering renewable fuel options (E85, biodiesel, electric charging), and carbon offset programs. We provide detailed consumption tracking to help users monitor their environmental impact. Partner stations are encouraged to offer sustainable fuel alternatives, and we're actively expanding our electric vehicle charging network across Europe."
  }
];

const partnerBrands = [
  {
    name: "Shell",
    logo: "https://cdn.builder.io/api/v1/image/assets%2F86f4e443f35a4609b52c42bedac1a4c2%2F21211a00521446d5a2cfd226b2fbf123?format=webp&width=200"
  },
  {
    name: "BP",
    logo: "https://cdn.builder.io/api/v1/image/assets%2F86f4e443f35a4609b52c42bedac1a4c2%2F8bff8b72abfe4383bdcffbbdaf194c60?format=webp&width=200"
  },
  {
    name: "TotalEnergies",
    logo: "https://cdn.builder.io/api/v1/image/assets%2F86f4e443f35a4609b52c42bedac1a4c2%2Fdebf3f2a92ba4f95a044fb20a1cf85ae?format=webp&width=200"
  },
  {
    name: "Esso",
    logo: "https://cdn.builder.io/api/v1/image/assets%2F86f4e443f35a4609b52c42bedac1a4c2%2F95b81c91c9794773bb96fd5a918c0846?format=webp&width=200"
  },
  {
    name: "Repsol",
    logo: "https://cdn.builder.io/api/v1/image/assets%2F86f4e443f35a4609b52c42bedac1a4c2%2F979cc08eb8ca413e93b9137860445d84?format=webp&width=200"
  },
  {
    name: "ENI",
    logo: "https://cdn.builder.io/api/v1/image/assets%2F86f4e443f35a4609b52c42bedac1a4c2%2F7710f08a3e7241cca5e04d5608598cb3?format=webp&width=200"
  },
  {
    name: "ARAL",
    logo: "https://cdn.builder.io/api/v1/image/assets%2F86f4e443f35a4609b52c42bedac1a4c2%2F1085a246fb9945f6a8019e7704c3f2fa?format=webp&width=200"
  },
  {
    name: "OMV",
    logo: "https://cdn.builder.io/api/v1/image/assets%2F86f4e443f35a4609b52c42bedac1a4c2%2F8772882d7d92415e9fb5ac419af8ccd4?format=webp&width=200"
  },
  {
    name: "ORLEN",
    logo: "https://cdn.builder.io/api/v1/image/assets%2F86f4e443f35a4609b52c42bedac1a4c2%2F81c5d46d062a4788a968c8580c4a3596?format=webp&width=200"
  },
  {
    name: "MOL",
    logo: "https://cdn.builder.io/api/v1/image/assets%2F86f4e443f35a4609b52c42bedac1a4c2%2F574318b47f0547edac4bb168276116fb?format=webp&width=200"
  }
];

export default function ComprehensiveFAQ() {
  const [isOpen, setIsOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-6 left-6 bg-black text-white px-6 py-3 rounded-full font-bold hover:bg-gray-800 transition-all transform hover:scale-105 z-50 shadow-lg flex items-center gap-2"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
        </svg>
        FAQ
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-start z-50 p-4">
      <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto relative animate-fade-in-up shadow-2xl">
        <div className="sticky top-0 bg-white rounded-t-3xl border-b border-gray-200 px-8 py-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="text-3xl font-black text-black">fuellfit</div>
            <div className="bg-black text-white px-3 py-1 rounded-full text-sm font-bold">
              Europe's #1 Fuel Savings App
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-500 hover:text-black text-3xl font-bold p-2 hover:bg-gray-100 rounded-full transition-all"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-8 space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-black text-black">
              Complete FAQ Guide
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to know about fuellfit's €15 welcome bonus, our partner network, and how to maximize your fuel savings across Europe.
            </p>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-6 border border-green-200">
            <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="text-3xl">🎁</span>
              €15 Welcome Bonus Details
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-xl">
                <div className="font-bold text-lg text-green-600">How to Get It</div>
                <div className="text-sm text-gray-700">Link your European bank card + Make first €20+ purchase</div>
              </div>
              <div className="bg-white p-4 rounded-xl">
                <div className="font-bold text-lg text-blue-600">When You Get It</div>
                <div className="text-sm text-gray-700">Instantly credited after qualifying purchase</div>
              </div>
              <div className="bg-white p-4 rounded-xl">
                <div className="font-bold text-lg text-purple-600">Where to Use It</div>
                <div className="text-sm text-gray-700">Any of 15,200+ partner stations across Europe</div>
              </div>
              <div className="bg-white p-4 rounded-xl">
                <div className="font-bold text-lg text-orange-600">Expiration</div>
                <div className="text-sm text-gray-700">Never expires, no hidden fees</div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-3xl font-bold text-center text-black mb-6">
              Detailed Answers to All Your Questions
            </h3>
            {comprehensiveFAQs.map((faq, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full px-6 py-5 text-left hover:bg-gray-50 transition-all duration-300 flex justify-between items-start group"
                >
                  <span className="text-lg font-semibold text-gray-900 group-hover:text-black transition-colors pr-4 leading-tight">
                    {faq.question}
                  </span>
                  <div className="flex-shrink-0 ml-4">
                    {openFaq === index ? (
                      <ChevronUp className="w-6 h-6 text-gray-600" />
                    ) : (
                      <ChevronDown className="w-6 h-6 text-gray-400 group-hover:text-gray-600" />
                    )}
                  </div>
                </button>
                <div
                  className={`overflow-hidden transition-all duration-500 ease-in-out ${
                    openFaq === index
                      ? "max-h-96 opacity-100"
                      : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="px-6 py-5 bg-gray-50 border-t border-gray-200">
                    <p className="text-gray-700 leading-relaxed text-base">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-black text-white rounded-2xl p-8">
            <h3 className="text-3xl font-bold text-center mb-8">
              Our Trusted Partner Network
            </h3>
            <p className="text-center text-gray-300 mb-8 text-lg">
              fuellfit works with Europe's leading fuel brands at 15,200+ locations
            </p>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
              {partnerBrands.map((brand, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl p-4 flex flex-col items-center justify-center space-y-2 hover:bg-gray-50 transition-colors"
                >
                  <img
                    src={brand.logo}
                    alt={`${brand.name} logo`}
                    className="h-12 w-auto object-contain"
                  />
                  <span className="text-sm font-semibold text-gray-900">
                    {brand.name}
                  </span>
                </div>
              ))}
            </div>
            <div className="text-center mt-8">
              <p className="text-gray-300 text-sm">
                Plus hundreds of independent stations across 30 European countries
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-2xl p-8 text-center">
            <h3 className="text-3xl font-bold mb-4">Ready to Start Saving?</h3>
            <p className="text-xl mb-6 text-blue-100">
              Join 2.5+ million Europeans already saving with fuellfit
            </p>
            <div className="grid md:grid-cols-3 gap-4 text-center">
              <div className="bg-white bg-opacity-20 rounded-xl p-4">
                <div className="text-2xl font-bold">€15</div>
                <div className="text-sm">Welcome Bonus</div>
              </div>
              <div className="bg-white bg-opacity-20 rounded-xl p-4">
                <div className="text-2xl font-bold">15,200+</div>
                <div className="text-sm">Partner Stations</div>
              </div>
              <div className="bg-white bg-opacity-20 rounded-xl p-4">
                <div className="text-2xl font-bold">12%</div>
                <div className="text-sm">Average Savings</div>
              </div>
            </div>
          </div>

          <div className="text-center text-gray-500 text-sm">
            <p>Need more help? Contact our 24/7 multilingual support team through the app</p>
          </div>
        </div>
      </div>
    </div>
  );
}
