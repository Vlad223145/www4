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
      // Reset form
      setCardNumber("");
      setExpiryDate("");
      setCvv("");
      setFirstName("");
      setLastName("");
      setCountry("");
      setZipCode("");
      setErrors({});
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
            /* Card Input Form - Exact Screenshot Design */
            <div className="space-y-6 pb-4">
              {/* Header with Icon */}
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                    <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-black">Card</h3>
              </div>

              {/* Card Information Section */}
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">
                  Card information
                </label>

                {/* Card Container - Exact like screenshot */}
                <div className="border border-gray-300 rounded-lg overflow-hidden bg-white">
                  {/* Card Number Field */}
                  <div className="relative">
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => {
                        setCardNumber(formatCardNumber(e.target.value));
                        setErrors({...errors, cardNumber: ''});
                      }}
                      placeholder="1234 1234 1234 1234"
                      maxLength={19}
                      className={`w-full px-4 py-4 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.cardNumber ? 'border-red-500' : ''}`}
                    />
                    {/* Payment Icons */}
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex space-x-1">
                      <div className="w-8 h-5 bg-blue-600 rounded text-white text-xs flex items-center justify-center font-bold">VISA</div>
                      <div className="w-8 h-5 bg-red-500 rounded flex items-center justify-center">
                        <div className="w-3 h-3 bg-red-600 rounded-full"></div>
                        <div className="w-3 h-3 bg-yellow-400 rounded-full -ml-1"></div>
                      </div>
                      <div className="w-8 h-5 bg-blue-500 rounded text-white text-xs flex items-center justify-center font-bold">AE</div>
                      <div className="w-8 h-5 bg-green-600 rounded text-white text-xs flex items-center justify-center font-bold">JCB</div>
                    </div>
                  </div>

                  {/* Bottom Fields - MM/YY and CVC */}
                  <div className="flex border-t border-gray-300">
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        value={expiryDate}
                        onChange={(e) => {
                          setExpiryDate(formatExpiryDate(e.target.value));
                          setErrors({...errors, expiryDate: ''});
                        }}
                        placeholder="MM / YY"
                        maxLength={5}
                        className={`w-full px-4 py-4 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 border-r border-gray-300 ${errors.expiryDate ? 'border-red-500' : ''}`}
                      />
                    </div>
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        value={cvv}
                        onChange={(e) => {
                          setCvv(e.target.value.replace(/\D/g, '').slice(0, 4));
                          setErrors({...errors, cvv: ''});
                        }}
                        placeholder="CVC"
                        maxLength={4}
                        className={`w-full px-4 py-4 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.cvv ? 'border-red-500' : ''}`}
                      />
                      {/* CVC Help Icon */}
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <div className="w-7 h-5 bg-gray-300 rounded text-xs flex items-center justify-center text-gray-600 font-mono">
                          123
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Display validation errors for card fields */}
                {(errors.cardNumber || errors.expiryDate || errors.cvv) && (
                  <div className="text-red-500 text-sm space-y-1">
                    {errors.cardNumber && <div>• {errors.cardNumber}</div>}
                    {errors.expiryDate && <div>• {errors.expiryDate}</div>}
                    {errors.cvv && <div>• {errors.cvv}</div>}
                  </div>
                )}
              </div>

              {/* Personal Information Section */}
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">
                  Personal information
                </label>

                {/* Name Fields */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => {
                        setFirstName(e.target.value);
                        setErrors({...errors, firstName: ''});
                      }}
                      placeholder="First name"
                      className={`w-full px-4 py-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.firstName ? 'border-red-500' : ''}`}
                    />
                    {errors.firstName && <div className="text-red-500 text-xs mt-1">{errors.firstName}</div>}
                  </div>
                  <div>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => {
                        setLastName(e.target.value);
                        setErrors({...errors, lastName: ''});
                      }}
                      placeholder="Last name"
                      className={`w-full px-4 py-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.lastName ? 'border-red-500' : ''}`}
                    />
                    {errors.lastName && <div className="text-red-500 text-xs mt-1">{errors.lastName}</div>}
                  </div>
                </div>

                {/* Country and ZIP */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <select
                      value={country}
                      onChange={(e) => {
                        setCountry(e.target.value);
                        setErrors({...errors, country: ''});
                      }}
                      className={`w-full px-4 py-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white ${errors.country ? 'border-red-500' : ''}`}
                    >
                      <option value="">Select country</option>
                      {countries.map((countryName) => (
                        <option key={countryName} value={countryName}>
                          {countryName}
                        </option>
                      ))}
                    </select>
                    {errors.country && <div className="text-red-500 text-xs mt-1">{errors.country}</div>}
                  </div>
                  <div>
                    <input
                      type="text"
                      value={zipCode}
                      onChange={(e) => {
                        setZipCode(e.target.value);
                        setErrors({...errors, zipCode: ''});
                      }}
                      placeholder="ZIP code"
                      className={`w-full px-4 py-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.zipCode ? 'border-red-500' : ''}`}
                    />
                    {errors.zipCode && <div className="text-red-500 text-xs mt-1">{errors.zipCode}</div>}
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  onClick={handleSubmit}
                  className="bg-green-500 hover:bg-green-600 text-black text-lg font-bold py-4 px-8 rounded-lg w-full transition-colors"
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
