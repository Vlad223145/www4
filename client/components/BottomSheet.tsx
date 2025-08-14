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
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [country, setCountry] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  
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

  const countries = [
    "Austria", "Belgium", "Bulgaria", "Croatia", "Cyprus", "Czech Republic",
    "Denmark", "Estonia", "Finland", "France", "Germany", "Greece", "Hungary",
    "Iceland", "Ireland", "Italy", "Latvia", "Lithuania", "Luxembourg", "Malta",
    "Netherlands", "Norway", "Poland", "Portugal", "Romania", "Slovakia",
    "Slovenia", "Spain", "Sweden", "Switzerland", "United Kingdom"
  ];

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    // Card number validation
    const cleanCardNumber = cardNumber.replace(/\s/g, '');
    if (!cleanCardNumber) {
      newErrors.cardNumber = "Card number is required";
    } else if (cleanCardNumber.length < 13 || cleanCardNumber.length > 19) {
      newErrors.cardNumber = "Invalid card number";
    }

    // Expiry date validation
    if (!expiryDate) {
      newErrors.expiryDate = "Expiry date is required";
    } else if (!/^\d{2}\/\d{2}$/.test(expiryDate)) {
      newErrors.expiryDate = "Invalid expiry date format";
    } else {
      const [month, year] = expiryDate.split('/');
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear() % 100;
      const currentMonth = currentDate.getMonth() + 1;

      if (parseInt(month) < 1 || parseInt(month) > 12) {
        newErrors.expiryDate = "Invalid month";
      } else if (parseInt(year) < currentYear || (parseInt(year) === currentYear && parseInt(month) < currentMonth)) {
        newErrors.expiryDate = "Card has expired";
      }
    }

    // CVV validation
    if (!cvv) {
      newErrors.cvv = "CVV is required";
    } else if (cvv.length < 3 || cvv.length > 4) {
      newErrors.cvv = "Invalid CVV";
    }

    // Name validation
    if (!firstName.trim()) {
      newErrors.firstName = "First name is required";
    } else if (firstName.length < 2) {
      newErrors.firstName = "First name must be at least 2 characters";
    }

    if (!lastName.trim()) {
      newErrors.lastName = "Last name is required";
    } else if (lastName.length < 2) {
      newErrors.lastName = "Last name must be at least 2 characters";
    }

    // Country validation
    if (!country) {
      newErrors.country = "Country is required";
    }

    // ZIP code validation
    if (!zipCode.trim()) {
      newErrors.zipCode = "ZIP code is required";
    } else if (zipCode.length < 3) {
      newErrors.zipCode = "Invalid ZIP code";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      // Form is valid, proceed with submission
      console.log("Form submitted successfully");
    }
  };

  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
      <div
        ref={sheetRef}
        className={`bg-white rounded-t-3xl w-full transition-all duration-500 ease-out transform ${
          isExpanded ? 'h-[75vh] translate-y-0' : 'h-20 translate-y-0'
        } ${isOpen ? 'translate-y-0' : 'translate-y-full'}`}
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
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-6 h-6 bg-black rounded-sm flex items-center justify-center">
                  <div className="w-4 h-3 bg-white rounded-sm"></div>
                </div>
                <h3 className="text-2xl font-bold text-black">Card</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-base font-medium text-gray-900 mb-3">
                    Card information
                  </label>

                  {/* Card Number Field with Icons */}
                  <div className="relative">
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                      placeholder="1234 1234 1234 1234"
                      maxLength={19}
                      className="w-full px-4 py-4 border border-gray-300 rounded-t-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex space-x-1">
                      <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAzMiAyMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjMyIiBoZWlnaHQ9IjIwIiByeD0iNCIgZmlsbD0iIzAwNTFBNSIvPgo8cGF0aCBkPSJNMTMuNSA2SDEwLjVWMTRIMTMuNVY2WiIgZmlsbD0id2hpdGUiLz4KPHA+PC9wYXRoPgo8L3N2Zz4K" alt="Visa" className="w-8 h-5" />
                      <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAzMiAyMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjMyIiBoZWlnaHQ9IjIwIiByeD0iNCIgZmlsbD0iI0VCMDAxQiIvPgo8Y2lyY2xlIGN4PSIxMiIgY3k9IjEwIiByPSI2IiBmaWxsPSIjRkY1RjAwIi8+CjxjaXJjbGUgY3g9IjIwIiBjeT0iMTAiIHI9IjYiIGZpbGw9IiNGRkY1RjAiLz4KPC9zdmc+" alt="Mastercard" className="w-8 h-5" />
                      <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAzMiAyMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjMyIiBoZWlnaHQ9IjIwIiByeD0iNCIgZmlsbD0iIzAwNkZDRiIvPgo8cGF0aCBkPSJNOCA2SDI0VjE0SDhWNloiIGZpbGw9IndoaXRlIi8+CjwvcGF0aD4KPC9zdmc+" alt="American Express" className="w-8 h-5" />
                      <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAzMiAyMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjMyIiBoZWlnaHQ9IjIwIiByeD0iNCIgZmlsbD0iIzAwNzk0MSIvPgo8cGF0aCBkPSJNOCA2SDE2VjE0SDhWNlpNMTYgNkgyNFYxNEgxNlY2WiIgZmlsbD0id2hpdGUiLz4KPC9zdmc+" alt="JCB" className="w-8 h-5" />
                    </div>
                  </div>

                  {/* MM/YY and CVC Fields */}
                  <div className="flex">
                    <input
                      type="text"
                      value={expiryDate}
                      onChange={(e) => setExpiryDate(formatExpiryDate(e.target.value))}
                      placeholder="MM / YY"
                      maxLength={5}
                      className="flex-1 px-4 py-4 border border-gray-300 border-t-0 border-r-0 rounded-bl-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                    />
                    <div className="relative flex-1">
                      <input
                        type="text"
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                        placeholder="CVC"
                        maxLength={4}
                        className="w-full px-4 py-4 border border-gray-300 border-t-0 rounded-br-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                      />
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <div className="w-6 h-4 bg-gray-300 rounded text-xs flex items-center justify-center text-gray-600 font-mono">
                          123
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <button
                  disabled={!cardNumber || !expiryDate || !cvv}
                  className="bg-green-500 hover:bg-green-600 text-black text-lg font-bold py-4 px-8 rounded-xl w-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Secure Card & Get €15 Bonus
                </button>

                <p className="text-xs text-gray-500 text-center mt-3">
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
