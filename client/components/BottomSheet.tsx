import { useState, useEffect, useRef } from "react";
import { X } from "lucide-react";

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function BottomSheet({ isOpen, onClose }: BottomSheetProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [showLoading, setShowLoading] = useState(false);
  const [showCardInput, setShowCardInput] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [cardHolder, setCardHolder] = useState("");
  
  const sheetRef = useRef<HTMLDivElement>(null);
  const startY = useRef(0);
  const currentY = useRef(0);

  useEffect(() => {
    if (isOpen) {
      setIsExpanded(true);
      setShowLoading(false);
      setShowCardInput(false);
      setIsConnecting(false);
    }
  }, [isOpen]);

  const handleConnect = () => {
    setIsConnecting(true);
    setShowLoading(true);
    
    setTimeout(() => {
      setShowLoading(false);
      setShowCardInput(true);
      setIsConnecting(false);
    }, 2000);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    startY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    currentY.current = e.touches[0].clientY;
    const diff = currentY.current - startY.current;
    
    if (diff > 50 && isExpanded) {
      setIsExpanded(false);
    } else if (diff < -50 && !isExpanded) {
      setIsExpanded(true);
    }
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end">
      <div
        ref={sheetRef}
        className={`bg-white rounded-t-3xl w-full transition-all duration-500 ease-out transform ${
          isExpanded ? 'h-[75vh]' : 'h-20'
        }`}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
      >
        {/* Handle */}
        <div className="flex justify-center pt-4 pb-2">
          <div 
            className="w-12 h-1.5 bg-gray-300 rounded-full cursor-pointer hover:bg-gray-400 transition-colors"
            onClick={() => setIsExpanded(!isExpanded)}
          />
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-black text-2xl font-bold p-2 hover:bg-gray-100 rounded-full transition-all z-10"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Content */}
        <div className={`px-6 pb-6 overflow-hidden transition-all duration-500 ${isExpanded ? 'opacity-100' : 'opacity-0'}`}>
          {!showCardInput ? (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-3xl font-black text-black mb-2">
                  Claim Your €15 Bonus
                </h3>
                <p className="text-gray-600">Connect your card and start saving instantly</p>
              </div>

              {/* Card Display */}
              <div className="flex justify-center">
                <div className="w-72 h-44 bg-black rounded-2xl shadow-2xl p-6 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div className="text-white text-sm font-medium">fuellfit</div>
                    <div className="text-white text-xl">CARD</div>
                  </div>
                  <div className="text-center">
                    <div className="text-white text-5xl font-black tracking-wide">
                      €15
                    </div>
                    <div className="text-white text-sm opacity-60 mt-1">
                      Welcome Bonus
                    </div>
                  </div>
                  <div className="text-white text-xs opacity-80">
                    Fuel Discount Card • Premium Member
                  </div>
                </div>
              </div>

              {/* Steps */}
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                    1
                  </div>
                  <div>
                    <h4 className="text-lg font-bold mb-1">Connect Your Card</h4>
                    <p className="text-gray-600 text-sm">
                      Link your European bank card for automatic fuel payments
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                    2
                  </div>
                  <div>
                    <h4 className="text-lg font-bold mb-1">Money Won't Be Charged</h4>
                    <p className="text-gray-600 text-sm">
                      We only verify your card - no charges until you fuel up
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                    3
                  </div>
                  <div>
                    <h4 className="text-lg font-bold mb-1">Get Your €15 QR Bonus</h4>
                    <p className="text-gray-600 text-sm">
                      Receive a QR code with €15 bonus ready to use at any partner station
                    </p>
                  </div>
                </div>
              </div>

              {/* Connect Button */}
              <div className="pt-4">
                {showLoading ? (
                  <div className="bg-green-500 text-black text-lg font-bold py-4 px-8 rounded-xl w-full flex items-center justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-2 border-black border-t-transparent mr-3"></div>
                    Connecting...
                  </div>
                ) : (
                  <button
                    onClick={handleConnect}
                    disabled={isConnecting}
                    className="bg-green-500 hover:bg-green-600 text-black text-lg font-bold py-4 px-8 rounded-xl w-full transition-colors disabled:opacity-50"
                  >
                    Connect
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* Card Input Form */
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-2xl font-black text-black mb-2">
                  Enter Your Card Details
                </h3>
                <p className="text-gray-600">Your information is secured with bank-level encryption</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Card Number
                  </label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent text-lg"
                  />
                </div>

                <div className="flex space-x-4">
                  <div className="flex-1">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      value={expiryDate}
                      onChange={(e) => setExpiryDate(formatExpiryDate(e.target.value))}
                      placeholder="MM/YY"
                      maxLength={5}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent text-lg"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      CVV
                    </label>
                    <input
                      type="text"
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                      placeholder="123"
                      maxLength={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent text-lg"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Cardholder Name
                  </label>
                  <input
                    type="text"
                    value={cardHolder}
                    onChange={(e) => setCardHolder(e.target.value.toUpperCase())}
                    placeholder="JOHN SMITH"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent text-lg"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <div className="bg-green-50 p-3 rounded-xl border border-green-200">
                  <div className="flex items-center space-x-2 text-green-700 text-sm">
                    <span className="font-semibold">🔒 SECURE</span>
                    <span>256-bit encryption • EU data protection</span>
                  </div>
                </div>

                <button
                  disabled={!cardNumber || !expiryDate || !cvv || !cardHolder}
                  className="bg-black hover:bg-gray-800 text-white text-lg font-bold py-4 px-8 rounded-xl w-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Secure Card & Get €15 Bonus
                </button>

                <p className="text-xs text-gray-500 text-center">
                  No charges • Instant verification • Cancel anytime
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Collapsed state content */}
        {!isExpanded && (
          <div className="px-6 py-2 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xs">€15</span>
              </div>
              <span className="font-semibold text-gray-900">Connect Card</span>
            </div>
            <div className="text-sm text-gray-500">Tap to expand</div>
          </div>
        )}
      </div>
    </div>
  );
}
