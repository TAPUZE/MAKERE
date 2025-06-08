import React, { useState, useEffect, useRef } from 'react';
import { Upload, FileText, CheckCircle, Send, Bot, User, Key, ShoppingCart, Image as ImageIcon, ExternalLink, Loader2, XCircle } from 'lucide-react';

// --- Hardcoded Data based on Israeli Market Research ---
const PRODUCT_CATALOG = {
  // Lighting
  "led-fixture": { name: "פנס PAR לד", name_en: "LED PAR Fixture", category: "Lighting", price: 150, unit: "unit" },
  "moving-head": { name: "ראש נע / רובוט", name_en: "Moving Head", category: "Lighting", price: 400, unit: "unit" },
  "wash-light": { name: "פנס שטיפה", name_en: "Wash Light", category: "Lighting", price: 200, unit: "unit" },
  "effect-light": { name: "פנס אפקטים", name_en: "Effect Light", category: "Lighting", price: 220, unit: "unit" },
  "wireless-led-tube": { name: "טיובת לד אלחוטית (Astera)", name_en: "Wireless LED Tube (Astera)", category: "Lighting", price: 150, unit: "unit" },
  "conventional-light": { name: "פנס קונבנציונלי (פרופיל/לקו)", name_en: "Conventional Light (Profile/Leko)", category: "Lighting", price: 200, unit: "unit" },
  "lighting-console-advanced": { name: "קונסולת תאורה מתקדמת", name_en: "Advanced Lighting Console", category: "Lighting", price: 300, unit: "unit" },
  "smoke-machine": { name: "מכונת עשן", name_en: "Smoke Machine", category: "Lighting", price: 250, unit: "unit" },
  "haze-machine": { name: "מכונת ערפל (Haze)", name_en: "Haze Machine", category: "Lighting", price: 300, unit: "unit" },
  "lighting-stand": { name: "סטנד תאורה / ליפט", name_en: "Lighting Stand / Lift", category: "Lighting", price: 200, unit: "unit" },

  // Sound
  "speaker-powered-500w": { name: 'רמקול מוגבר 500W', name_en: '500W Powered Speaker', category: "Sound", price: 220, unit: "unit" },
  "subwoofer-15": { name: 'סאב וופר 15"', name_en: '15" Subwoofer', category: "Sound", price: 250, unit: "unit" },
  "stage-monitor": { name: "מוניטור במה", name_en: "Stage Monitor", category: "Sound", price: 250, unit: "unit" },
  "mic-wireless-pro": { name: "מיקרופון אלחוטי מקצועי", name_en: "Professional Wireless Mic", category: "Sound", price: 120, unit: "unit" },
  "mic-wired-sm58": { name: "מיקרופון חוטי (Shure SM58)", name_en: "Wired Microphone (Shure SM58)", category: "Sound", price: 80, unit: "unit" },
  "mixer-12ch": { name: "מיקסר 12 ערוצים", name_en: "12-Channel Mixer", category: "Sound", price: 199, unit: "unit" },
  "sound-console-digital": { name: "קונסולת סאונד דיגיטלית גדולה", name_en: "Large Digital Sound Console", category: "Sound", price: 1200, unit: "unit" },
  
  // Video
  "led-screen-sqm": { name: 'מסך לד (למ"ר)', name_en: 'LED Screen (per sq. meter)', category: "Video", price: 500, unit: 'sq. meter' },
  "projector-5000-lumens": { name: "מקרן 5000 לומנס HD", name_en: "Projector 5000 Lumens HD", category: "Video", price: 550, unit: "unit" },
  "projection-screen": { name: "מסך הקרנה על חצובה", name_en: "Tripod Projection Screen", category: "Video", price: 150, unit: "unit" },
  "tv-65": { name: 'מסך 65" על סטנד', name_en: '65" TV on Stand', category: "Video", price: 690, unit: "unit" },
  "tv-85": { name: 'מסך 85" על סטנד', name_en: '85" TV on Stand', category: "Video", price: 1600, unit: "unit" },
  "video-switcher": { name: "ממתג וידאו (סוויצ'ר)", name_en: "Video Switcher", category: "Video", price: 500, unit: "unit" },
  "resolume-pc": { name: "מחשב Resolume/VJ", name_en: "Resolume/VJ PC", category: "Video", price: 800, unit: "unit" },

  // Staging & Rigging
  "stage-deck-2x1": { name: "במה מודולרית (פלטה 2x1 מטר)", name_en: "Modular Stage Deck (2x1m)", category: "Staging & Rigging", price: 300, unit: "unit" },
  "truss-meter": { name: "טראס (למטר)", name_en: "Truss (per meter)", category: "Staging & Rigging", price: 150, unit: "meter" },
  "chain-hoist": { name: "מנוע שרשרת חשמלי", name_en: "Electric Chain Hoist", category: "Staging & Rigging", price: 500, unit: "unit" },
  "crowd-barrier": { name: "מחסום לחץ", name_en: "Crowd Barrier", category: "Staging & Rigging", price: 30, unit: "unit" },

  // Power
  "generator-small": { name: "גנרטור קטן (עד 3.5kW)", name_en: "Small Generator (up to 3.5kW)", category: "Power", price: 500, unit: "unit" },
  "generator-large": { name: "גנרטור גדול (30kW+)", name_en: "Large Generator (30kW+)", category: "Power", price: 2000, unit: "unit" },
  "distro-board": { name: "לוח חשמל (פילר)", name_en: "Distribution Board", category: "Power", price: 300, unit: "unit" },
  "cable-protector": { name: "מגן כבלים (פס דריכה)", name_en: "Cable Protector", category: "Power", price: 50, unit: 'meter' },

  // Personnel
  "stagehand": { name: "פועל במה", name_en: "Stagehand", category: "Personnel", price: 600, unit: "work day" },
  "rigger": { name: "טכנאי ריגינג (ריגר)", name_en: "Rigger", category: "Personnel", price: 1500, unit: "work day" },
  "sound-tech": { name: "טכנאי סאונד", name_en: "Sound Technician", category: "Personnel", price: 1500, unit: "work day" },
  "lighting-tech": { name: "טכנאי תאורה", name_en: "Lighting Technician", category: "Personnel", price: 1500, unit: "work day" },
  "video-tech": { name: "טכנאי וידאו", name_en: "Video Technician", category: "Personnel", price: 1500, unit: "work day" },
  "project-manager": { name: "מנהל פרויקט", name_en: "Project Manager", category: "Personnel", price: 3000, unit: "work day" },
  "safety-manager": { name: "מנהל בטיחות", name_en: "Safety Manager", category: "Personnel", price: 2500, unit: "work day" }
};

// --- Main App Component ---
export default function App() {
  const [currentStep, setCurrentStep] = useState('order'); // order, quote, receipt
  const [userRole, setUserRole] = useState('client'); // client, manager
  const [orderData, setOrderData] = useState(null);
  const [quote, setQuote] = useState({ items: [], status: 'draft', totals: { subtotal: 0, vat: 0, total: 0 } });
  const [isLoading, setIsLoading] = useState(false);
  const [isManagerView, setIsManagerView] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const [initialOrderLoaded, setInitialOrderLoaded] = useState(false);

  const showNotification = (message, type = 'info', duration = 4000) => {
        setNotification({ show: true, message, type });
        setTimeout(() => {
            setNotification({ show: false, message: '', type: '' });
        }, duration);
    };

  const loadInitialOrderFromMake = () => {
    // Simulate receiving an initial product list from Make.com
    const initialItems = [
      { id: "led-screen-sqm", quantity: 15 },
      { id: "speaker-powered-500w", quantity: 2 },
      { id: "stage-deck-2x1", quantity: 8 },
    ];
    setQuote(prev => ({...prev, items: initialItems, status: 'pre-draft'}));
    setInitialOrderLoaded(true);
    setCurrentStep('order');
    showNotification("Initial equipment list loaded from Make.com. The client is requested to add details and an image.", 'success', 6000);
  };


  const handleOrderSubmit = (data) => {
    setOrderData(data);
    // The items are already in the quote state from the pre-populated step
    setQuote(prev => ({...prev, status: 'draft'})); // Status changes to 'draft' ready for manager
    setCurrentStep('quote');
    showNotification("The order has been updated with client details and sent to the manager for AI processing.", "success");
    // This is a new notification specifically for the manager
    setTimeout(() => {
      showNotification("Manager, a new order is waiting for quote generation via AI.", "info", 6000)
    }, 1000);
  };

  const handleAiGenerateQuote = async () => {
    setIsLoading(true);

    const { eventDescription, imageBase64 } = orderData;
    const initialItemsList = quote.items;

    const prompt = `
      Analyze the following event request which includes an initial equipment list, a user description, and an image of the venue/stage.
      Refine the initial equipment list based on ALL available information.
      
      1. Initial List: ${JSON.stringify(initialItemsList)}
      2. User Description: "${eventDescription}"
      3. Image Analysis: Look at the provided image to understand the scale, location (indoor/outdoor), and general setup.

      Generate a revised, comprehensive list of equipment needed from the provided catalog.
      Catalog: ${JSON.stringify(Object.keys(PRODUCT_CATALOG))}
      
      Provide the output as a JSON array of objects, where each object has "id" and "quantity".
    `;
    
    // Simulating API call delay for Gemini multimodal analysis
    await new Promise(resolve => setTimeout(resolve, 2500));

    // --- MOCKED AI RESPONSE (Now with simulated image analysis) ---
    const newItems = new Map();
    initialItemsList.forEach(item => newItems.set(item.id, { ...item }));

    const addOrUpdateItem = (id, qty) => {
        if (newItems.has(id)) {
            const currentQty = newItems.get(id).quantity;
            newItems.set(id, { id, quantity: Math.max(currentQty, qty) }); // Use the larger quantity
        } else {
            newItems.set(id, { id, quantity: qty });
        }
    };
    
    const description = eventDescription.toLowerCase();
    
    // Text-based analysis
    if (description.includes("lighting")) addOrUpdateItem("lighting-tech", 1);
    if (description.includes("band") || description.includes("sound")) {
        addOrUpdateItem("sound-tech", 1);
        addOrUpdateItem("mic-wireless-pro", 4);
    }

    // SIMULATED Image-based analysis
    if (imageBase64) {
        showNotification("AI is analyzing the image...", "info");
        // Simulate AI seeing a large stage, adds more decks
        addOrUpdateItem("stage-deck-2x1", 20); 
        // Simulate AI seeing an outdoor setting
        addOrUpdateItem("generator-large", 1);
        // Simulate AI seeing trussing is needed
        addOrUpdateItem("truss-meter", 40);
        addOrUpdateItem("rigger", 2);
    }
    
    // Always add core personnel
    addOrUpdateItem("stagehand", 4);
    if (newItems.size > 5) addOrUpdateItem("project-manager", 1);

    setQuote(prev => ({ ...prev, items: Array.from(newItems.values()), status: 'review' }));
    setIsLoading(false);
    showNotification("Quote generated by AI, ready for manager review.", "success");
  };
  
  const calculateTotals = (items) => {
        const subtotal = items.reduce((acc, item) => {
            const product = PRODUCT_CATALOG[item.id];
            return acc + (product ? product.price * item.quantity : 0);
        }, 0);
        const vat = subtotal * 0.17;
        const total = subtotal + vat;
        return { subtotal, vat, total };
    };

    useEffect(() => {
        if (quote.items) {
            const totals = calculateTotals(quote.items);
            setQuote(prev => ({ ...prev, totals }));
        }
    }, [quote.items]);


  const handleUpdateItem = (index, newQuantity) => {
    const updatedItems = [...quote.items];
    updatedItems[index].quantity = Math.max(0, newQuantity);
    setQuote(prev => ({ ...prev, items: updatedItems }));
  };

  const handleRemoveItem = (index) => {
    const updatedItems = quote.items.filter((_, i) => i !== index);
    setQuote(prev => ({ ...prev, items: updatedItems }));
  };
  
  const handleAddItem = (itemId) => {
    if (!itemId || !PRODUCT_CATALOG[itemId]) return;
    const existingItemIndex = quote.items.findIndex(item => item.id === itemId);
    if (existingItemIndex > -1) {
        const updatedItems = [...quote.items];
        updatedItems[existingItemIndex].quantity += 1;
        setQuote(prev => ({ ...prev, items: updatedItems }));
    } else {
        const newItems = [...quote.items, { id: itemId, quantity: 1 }];
        setQuote(prev => ({ ...prev, items: newItems }));
    }
    showNotification(`${PRODUCT_CATALOG[itemId].name_en} added to quote.`, 'success');
  };

  const handleApproveQuote = () => {
    setQuote(prev => ({ ...prev, status: 'approved' }));
    setUserRole('client');
    setIsManagerView(false);
    showNotification("Quote approved and sent to client.", "success");
  };

  const handleAcceptQuote = () => {
    setQuote(prev => ({ ...prev, status: 'accepted' }));
    setCurrentStep('receipt');
     showNotification("Thank you! We will contact you shortly to finalize the details.", "success");
  };

  const handleSendToMake = (payload, webhookName) => {
    console.log(`--- SIMULATING SENDING TO MAKE.COM (${webhookName}) ---`);
    console.log(JSON.stringify(payload, null, 2));
    showNotification(`Data successfully sent to ${webhookName} system.`);
  };
  return (
    <div className="app-container" dir="ltr">
        {notification.show && <Notification message={notification.message} type={notification.type} onClose={() => setNotification({ show: false, message: '', type: '' })} />}
        <div className="main-content">
            <Header userRole={userRole} setUserRole={setUserRole} isManagerView={isManagerView} setIsManagerView={setIsManagerView} />
            
            <main className="content">
                {!initialOrderLoaded && (
                    <div style={{ textAlign: 'center', padding: '40px' }}>
                        <h2 style={{ fontSize: '2rem', fontWeight: '600', color: '#475569', marginBottom: '16px' }}>Welcome</h2>
                        <p style={{ color: '#64748b', marginBottom: '24px' }}>Click the button to simulate receiving a new order from the Make.com system</p>
                        <button onClick={loadInitialOrderFromMake} className="btn btn-lg" style={{ margin: '0 auto', display: 'inline-flex' }}>
                           <ExternalLink size={20}/> Load Order from Make.com
                        </button>
                    </div>
                )}

                {initialOrderLoaded && currentStep === 'order' && <OrderForm onSubmit={handleOrderSubmit} onSendToMake={handleSendToMake} initialItems={quote.items} />}
                
                {currentStep === 'quote' && (
                    <QuoteView
                        orderData={orderData}
                        quote={quote}
                        isLoading={isLoading}
                        isManagerView={isManagerView}
                        onAiGenerate={handleAiGenerateQuote}
                        onApprove={handleApproveQuote}
                        onAccept={handleAcceptQuote}
                        onUpdateItem={handleUpdateItem}
                        onRemoveItem={handleRemoveItem}
                        onAddItem={handleAddItem}
                        onSendToMake={handleSendToMake}
                    />
                )}

                {currentStep === 'receipt' && <ReceiptView quote={quote} orderData={orderData} onSendToMake={handleSendToMake} />}
            </main>
        </div>
        <footer style={{ textAlign: 'center', color: '#64748b', marginTop: '32px', fontSize: '0.9rem' }}>
            <p>&copy; 2025 Production Management System. Developed by Gemini.</p>
        </footer>
    </div>
  );
}

// --- Components ---

function Header({ userRole, setUserRole, isManagerView, setIsManagerView }) {
    return (
        <header className="header" style={{ position: 'relative' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <ShoppingCart style={{ width: '32px', height: '32px', color: '#60a5fa' }} />
                <h1>MAKERE - Production Management</h1>
            </div>
            <p>Event Equipment Calculator & Quote Generator</p>
            <div className="role-toggle">
                <span style={{ fontSize: '0.9rem', opacity: '0.9' }}>View Mode:</span>
                 <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.2)', borderRadius: '20px', padding: '4px' }}>
                    <button 
                        onClick={() => { setUserRole('client'); setIsManagerView(false); }} 
                        className={`btn btn-sm ${!isManagerView ? 'btn-success' : 'btn-outline'}`}
                        style={{ margin: '0 4px', borderRadius: '16px' }}
                    >
                        <User size={16} /> Client
                    </button>
                    <button 
                        onClick={() => { setUserRole('manager'); setIsManagerView(true); }} 
                        className={`btn btn-sm ${isManagerView ? 'btn-success' : 'btn-outline'}`}
                        style={{ margin: '0 4px', borderRadius: '16px' }}
                    >
                        <Key size={16} /> Manager
                    </button>
                </div>
            </div>
        </header>
    );
}

function OrderForm({ onSubmit, onSendToMake, initialItems }) {
    const [formData, setFormData] = useState({ clientName: '', clientPhone: '', eventDescription: '' });
    const [imageFile, setImageFile] = useState(null);
    const [imageBase64, setImageBase64] = useState('');
    const fileInputRef = useRef();

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onload = (loadEvent) => {
                setImageBase64(loadEvent.target.result.split(',')[1]); // Store only base64 data
            };
            reader.readAsDataURL(file);
        }
    };
    
    const handleSubmit = (e) => {
        e.preventDefault();
        const fullOrderData = { ...formData, imageFile, imageBase64 };
        onSubmit(fullOrderData);
        onSendToMake(fullOrderData, 'Updated Order with Image');
    };

    return (
        <div className="animate-fade-in">
            <h2 className="text-2xl font-semibold text-slate-700 mb-6 flex items-center gap-2"><FileText />Complete Order Details</h2>
            <div className="bg-slate-50 p-4 rounded-lg mb-6 border border-slate-200">
              <h3 className="font-bold text-slate-600 mb-2">Initial Equipment List:</h3>
              <ul className="list-disc list-inside text-slate-500 space-y-1">
                {initialItems.map(item => <li key={item.id}>{PRODUCT_CATALOG[item.id].name_en} (x{item.quantity})</li>)}
              </ul>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
                 <div>
                    <label htmlFor="eventDescription" className="block text-sm font-medium text-slate-600 mb-1">Additional Event Description</label>
                    <textarea name="eventDescription" id="eventDescription" rows="4" required className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition" placeholder="Please describe the event, highlighting important details for the AI. e.g., 'This is an outdoor concert, a generator is crucial. The stage is very wide.'" onChange={handleChange}></textarea>
                </div>
                <div>
                     <label className="block text-sm font-medium text-slate-600 mb-2">Upload Stage/Venue Image</label>
                    <div onClick={() => fileInputRef.current.click()} className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center cursor-pointer hover:border-cyan-500 hover:bg-slate-50 transition">
                        <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
                        <ImageIcon className="mx-auto text-slate-400 w-12 h-12 mb-2" />
                        <p className="text-slate-500">Click here to upload an image</p>
                        <p className="text-xs text-slate-400 mt-1">The AI will use the image to understand the venue's size and type</p>
                    </div>
                    {imageFile && (
                        <div className="mt-4 text-center">
                            <p className="font-semibold text-green-600">File <span className="font-mono">{imageFile.name}</span> selected successfully.</p>
                        </div>
                    )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="clientName" className="block text-sm font-medium text-slate-600 mb-1">Full Name</label>
                        <input type="text" name="clientName" id="clientName" required className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition" onChange={handleChange} />
                    </div>
                    <div>
                        <label htmlFor="clientPhone" className="block text-sm font-medium text-slate-600 mb-1">Contact Phone</label>
                        <input type="tel" name="clientPhone" id="clientPhone" required className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition" onChange={handleChange} />
                    </div>
                </div>
                <div className="text-right">
                     <button type="submit" className="bg-cyan-500 text-white font-bold py-3 px-8 rounded-lg hover:bg-cyan-600 transition-all duration-300 flex items-center gap-2 text-lg shadow-lg hover:shadow-cyan-500/50">
                        <Send size={20}/> Update Order & Send to Manager
                    </button>
                </div>
            </form>
        </div>
    );
}

function QuoteView({ orderData, quote, isLoading, isManagerView, onAiGenerate, onApprove, onAccept, onUpdateItem, onRemoveItem, onAddItem, onSendToMake }) {
    const AddItemCta = ({onAddItem}) => {
        const [selectedItem, setSelectedItem] = useState('');
        const handleAdd = () => { onAddItem(selectedItem); setSelectedItem(''); }
        return (
            <div className="mt-6 flex gap-2">
                <select value={selectedItem} onChange={(e) => setSelectedItem(e.target.value)} className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500">
                    <option value="">Select an item to add...</option>
                    {Object.entries(PRODUCT_CATALOG).map(([id, product]) => (<option key={id} value={id}>{product.name_en} ({product.category})</option>))}
                </select>
                <button onClick={handleAdd} className="bg-slate-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-slate-700 transition-colors" disabled={!selectedItem}>Add</button>
            </div>
        );
    }
    
    return (
        <div className="animate-fade-in">
            <h2 className="text-2xl font-semibold text-slate-700 mb-4">Quote for: {orderData?.clientName}</h2>
            
            {quote.status === 'draft' && isManagerView && (
                <div className="bg-amber-100 border-l-4 border-amber-500 text-amber-800 p-6 rounded-lg my-6 text-center shadow">
                    <h3 className="font-bold text-xl mb-2">Step 1: Run AI to Generate Quote</h3>
                    <p className="mb-2">The client has sent the event description and a venue image.</p>
                     {orderData.imageFile && <p className="text-sm font-semibold mb-4">Image attached: <span className='font-mono'>{orderData.imageFile.name}</span></p>}
                    <p className="mb-4">Click the button for the AI to analyze the information and generate a detailed quote.</p>
                    <button onClick={onAiGenerate} disabled={isLoading} className="bg-amber-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-amber-600 transition-all duration-300 flex items-center gap-2 mx-auto disabled:bg-slate-400 disabled:cursor-wait">
                        {isLoading ? (<> <Loader2 className="animate-spin" size={20}/> Processing...</>) : (<><Bot size={20}/> Generate Quote with AI (incl. Image Analysis)</>)}
                    </button>
                </div>
            )}
            
            {(quote.status !== 'draft' && quote.status !== 'pre-draft') && <QuoteTable quote={quote} isManagerView={isManagerView} onUpdateItem={onUpdateItem} onRemoveItem={onRemoveItem}/>}

            {isManagerView && quote.status === 'review' && (
                 <div className="bg-fuchsia-100 border-l-4 border-fuchsia-500 text-fuchsia-800 p-6 rounded-lg my-6 shadow">
                     <h3 className="font-bold text-xl mb-2">Step 2: Manager Review and Edit</h3>
                     <p className="mb-4">This is the AI-generated quote. You can edit quantities, remove items, or add new ones before sending to the client.</p>
                     <AddItemCta onAddItem={onAddItem} />
                     <div className="mt-6 flex justify-between items-center">
                         <button onClick={() => { onSendToMake({ quote, client: orderData }, 'Quote For Approval'); onApprove(); }} className="bg-green-500 text-white font-bold py-3 px-8 rounded-lg hover:bg-green-600 transition-all duration-300 flex items-center gap-2 text-lg shadow-lg hover:shadow-green-500/50">
                            <CheckCircle size={20}/> Approve and Send to Client
                        </button>
                     </div>
                </div>
            )}

            {!isManagerView && quote.status === 'approved' && (
                 <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-800 p-6 rounded-lg my-6 shadow">
                     <h3 className="font-bold text-xl mb-2">Your Quote is Ready!</h3>
                     <p className="mb-4">Hello {orderData.clientName}, your quote is ready. Please review the details and approve to continue.</p>
                     <button onClick={onAccept} className="bg-blue-500 text-white font-bold py-3 px-8 rounded-lg hover:bg-blue-600 transition-all duration-300 flex items-center gap-2 text-lg shadow-lg hover:shadow-blue-500/50">
                        <CheckCircle size={20}/> I Approve This Quote
                    </button>
                </div>
            )}
             {!isManagerView && quote.status === 'accepted' && (
                 <div className="bg-green-100 border-l-4 border-green-500 text-green-800 p-6 rounded-lg my-6 shadow text-center">
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <h3 className="font-bold text-2xl">Quote Approved!</h3>
                    <p>Thank you! A representative will contact you shortly.</p>
                 </div>
             )}
        </div>
    );
}

function QuoteTable({ quote, isManagerView, onUpdateItem, onRemoveItem }) {
    if (!quote.items || quote.items.length === 0) return <div className="text-center py-10 text-slate-500">No items have been added to the quote yet.</div>;
    const THead = () => (<thead className="bg-slate-200"><tr><th className="p-3 text-left font-semibold text-slate-600">Category</th><th className="p-3 text-left font-semibold text-slate-600">Item</th><th className="p-3 text-center font-semibold text-slate-600">Unit Price</th><th className="p-3 text-center font-semibold text-slate-600">Quantity</th><th className="p-3 text-right font-semibold text-slate-600">Total</th>{isManagerView && <th className="p-3 text-center font-semibold text-slate-600">Actions</th>}</tr></thead>);
    const TBody = () => (<tbody>{quote.items.map((item, index) => { const product = PRODUCT_CATALOG[item.id]; if (!product) return null; const totalItemPrice = product.price * item.quantity; return (<tr key={index} className="border-b border-slate-200 hover:bg-slate-50"><td className="p-3">{product.category}</td><td className="p-3 font-medium text-slate-800">{product.name_en}</td><td className="p-3 text-center">₪{product.price.toFixed(2)}</td><td className="p-3 text-center">{isManagerView ? (<input type="number" value={item.quantity} onChange={(e) => onUpdateItem(index, parseInt(e.target.value))} className="w-20 p-1 border border-slate-300 rounded-md text-center" />) : item.quantity}</td><td className="p-3 text-right font-semibold">₪{totalItemPrice.toFixed(2)}</td>{isManagerView && (<td className="p-3 text-center"><button onClick={() => onRemoveItem(index)} className="text-red-500 hover:text-red-700"><XCircle size={20} /></button></td>)}</tr>); })}</tbody>);
    const TFoot = () => (<tfoot><tr className="bg-slate-50 font-bold"><td colSpan={isManagerView ? "4" : "3"} className="p-3 text-left">Subtotal:</td><td className="p-3 text-right">₪{quote.totals.subtotal.toFixed(2)}</td>{isManagerView && <td></td>}</tr><tr className="bg-slate-50 font-bold"><td colSpan={isManagerView ? "4" : "3"} className="p-3 text-left">VAT (17%):</td><td className="p-3 text-right">₪{quote.totals.vat.toFixed(2)}</td>{isManagerView && <td></td>}</tr><tr className="bg-slate-200 text-lg font-extrabold text-slate-800"><td colSpan={isManagerView ? "4" : "3"} className="p-4 text-left">Grand Total:</td><td className="p-4 text-right">₪{quote.totals.total.toFixed(2)}</td>{isManagerView && <td></td>}</tr></tfoot>);
    return (<div className="mt-6 border border-slate-200 rounded-lg overflow-hidden"><table className="w-full"><THead /><TBody /><TFoot /></table></div>);
}

function ReceiptView({ quote, orderData, onSendToMake }) {
    const receiptData = { quote, client: orderData, issueDate: new Date().toLocaleDateString('en-GB') };
    return (
        <div className="animate-fade-in p-8 border border-slate-300 rounded-lg bg-white shadow-lg">
             <div className="flex justify-between items-start pb-6 border-b-2 border-slate-200">
                <div><h2 className="text-3xl font-bold text-slate-800">Tax Invoice</h2><p className="text-slate-500">Invoice #: {Math.floor(1000 + Math.random() * 9000)}</p><p className="text-slate-500">Issue Date: {receiptData.issueDate}</p></div>
                <div className="text-right"><h3 className="text-xl font-bold">The Company Inc.</h3><p className="text-slate-600">1 HaMeyasdim St, Tel Aviv</p><p className="text-slate-600">Company ID 512345678</p></div>
            </div>
            <div className="my-6"><h4 className="font-semibold text-slate-600 mb-2">Bill To:</h4><p className="font-bold text-slate-800">{orderData.clientName}</p><p className="text-slate-600">{orderData.clientPhone}</p></div>
            <QuoteTable quote={quote} isManagerView={false} />
            <div className="mt-8 flex justify-between items-center"><p className="text-sm text-slate-500">Thank you for your business!</p><button onClick={() => onSendToMake(receiptData, 'New Receipt')} className="bg-purple-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-purple-600 transition-all duration-300 flex items-center gap-2"><Send size={16}/> Send to Accounting (Make)</button></div>
        </div>
    );
}

function Notification({ message, type, onClose }) {
    const baseStyle = "fixed top-5 right-5 z-50 p-4 rounded-lg shadow-lg flex items-center gap-3 text-white transition-all duration-300 transform animate-fade-in-down";
    const typeStyles = { success: "bg-green-500", info: "bg-blue-500", error: "bg-red-500" };
    const Icon = { success: <CheckCircle />, info: <Bot />, error: <XCircle /> }[type] || <CheckCircle />;
    return (<div className={`${baseStyle} ${typeStyles[type] || typeStyles.success}`}>{Icon}<span>{message}</span><button onClick={onClose} className="absolute top-1 right-1 text-white/70 hover:text-white"><XCircle size={16} /></button></div>);
}
