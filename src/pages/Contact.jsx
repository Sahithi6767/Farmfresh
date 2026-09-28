import React, { useState } from 'react';
import { Mail, Phone, MapPin, Compass, HelpCircle, ChevronDown, CheckCircle2 } from 'lucide-react';

export const Contact = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [inquiryType, setInquiryType] = useState('Customer Support');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  // FAQ Accordion State
  const [openFaqIdx, setOpenFaqIdx] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email || !message) {
      alert('Please fill out all fields');
      return;
    }
    setSubmitted(true);
    // Reset Form
    setName('');
    setEmail('');
    setMessage('');
  };

  const faqs = [
    {
      q: 'How long does delivery take after ordering?',
      a: 'We harvest your order the same day or early next morning. Delivery is completed within 12-16 hours of the crop being plucked from the tree or field, ensuring maximum freshness without warehouse freezing.'
    },
    {
      q: 'Are all products certified organic?',
      a: 'Yes, 100% of our vegetables, fruits, and dairy products are grown using organic fertilizers (vermicompost, cow manure) and pesticide-free pest control methods. Each product listing displays the farm origin and credentials.'
    },
    {
      q: 'How is the pricing distributed to the farmers?',
      a: 'Unlike traditional supply chains where farmers earn less than 20% of the market value, FarmFresh operates on a direct-trade model. Over 80% of the list price is deposited directly to the harvesting family.'
    },
    {
      q: 'Can other rural farmers onboard onto this app?',
      a: 'Absolutely! If you own family farm orchards, you can register as a partner farmer. Submit an inquiry through this contact page, selecting "Farmer Collaboration Inquiry" as your message type.'
    }
  ];

  return (
    <div className="space-y-16 pb-12">
      
      {/* Page Header */}
      <section className="text-center max-w-xl mx-auto space-y-2">
        <h2 className="text-2xl font-display font-black text-slate-800">Get in Touch</h2>
        <p className="text-xs text-slate-400 font-medium">Contact customer support or query farmer onboarding collaboration</p>
      </section>

      {/* Main Section */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* Left Side: Contact details */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm space-y-6">
            <h3 className="font-display font-bold text-slate-800 text-base">Direct Channels</h3>
            
            <div className="space-y-4 text-xs font-semibold text-slate-600">
              <div className="flex gap-3">
                <div className="bg-slate-50 text-farm-600 p-2.5 rounded-xl border border-slate-100 h-10 w-10 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-bold uppercase">Customer Support</span>
                  <span className="text-slate-800">support@farmfresh.com</span>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="bg-slate-50 text-farm-600 p-2.5 rounded-xl border border-slate-100 h-10 w-10 flex items-center justify-center flex-shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-bold uppercase">Partner Hotline</span>
                  <span className="text-slate-800">+91 94401 12233 (Mon - Sat, 9 AM - 6 PM)</span>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="bg-slate-50 text-farm-600 p-2.5 rounded-xl border border-slate-100 h-10 w-10 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-bold uppercase">Family Orchard HQ</span>
                  <span className="text-slate-850">Anugu Farms Road, Chittoor District, AP - 517124</span>
                </div>
              </div>
            </div>

          </div>

          <div className="bg-emerald-900 text-white rounded-2xl p-6 shadow-sm space-y-3 relative overflow-hidden">
            <div className="absolute right-0 bottom-0 opacity-10 flex items-center pr-4 pointer-events-none">
              <Compass className="w-24 h-24" />
            </div>
            <h4 className="font-display font-bold text-sm">Onboarding For Farmers</h4>
            <p className="text-[11px] text-slate-200 leading-relaxed font-medium">
              Are you a farmer practicing natural multi-crop harvesting? Contact us to audit your soil and list your products on FarmFresh.
            </p>
          </div>
        </div>

        {/* Right Side: Message Submission Form */}
        <div className="lg:col-span-7 bg-white border border-slate-100 p-6 md:p-8 rounded-2xl shadow-sm space-y-6">
          <h3 className="font-display font-bold text-slate-800 text-base">Inquiry Form</h3>

          {submitted ? (
            <div className="bg-emerald-50 text-emerald-700 border border-emerald-100 p-6 rounded-2xl text-center space-y-3 animate-pulse-soft">
              <CheckCircle2 className="w-10 h-10 mx-auto text-emerald-600" />
              <h4 className="font-bold text-sm">Message Submitted Successfully!</h4>
              <p className="text-xs text-slate-500 font-medium">
                Thank you for contacting FarmFresh. Our team will review your inquiry and reply to your email address within 24 hours.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="px-4 py-2 bg-farm-600 text-white font-bold text-xs rounded-xl shadow cursor-pointer mt-2"
              >
                Send New Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Rohini Patil"
                    className="w-full text-xs font-semibold p-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:border-farm-500 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. rohini@gmail.com"
                    className="w-full text-xs font-semibold p-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:border-farm-500 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase">Inquiry Type</label>
                <select
                  value={inquiryType}
                  onChange={(e) => setInquiryType(e.target.value)}
                  className="w-full text-xs font-bold p-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:border-farm-500 focus:bg-white"
                >
                  <option value="Customer Support">Customer Support Inquiry</option>
                  <option value="Farmer Collaboration">Farmer Collaboration Inquiry</option>
                  <option value="Corporate Order">Corporate Gift Basket Bulk Orders</option>
                  <option value="Media/Press">Media & Press Inquiries</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase">Message</label>
                <textarea
                  rows="4"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="How can our direct trade team assist you?"
                  className="w-full text-xs font-semibold p-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:border-farm-500 focus:bg-white"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-farm-600 hover:bg-farm-700 text-white font-bold text-xs rounded-xl shadow transition-all cursor-pointer"
              >
                Send Message
              </button>
            </form>
          )}
        </div>

      </section>

      {/* Accordion FAQ Section */}
      <section className="space-y-6 max-w-3xl mx-auto">
        <h3 className="font-display font-black text-slate-800 text-xl flex items-center gap-1.5 justify-center">
          <HelpCircle className="w-5 h-5 text-farm-600" /> Frequently Asked Questions
        </h3>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaqIdx === idx;
            return (
              <div 
                key={idx} 
                className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-xs transition-shadow"
              >
                <button
                  onClick={() => setOpenFaqIdx(isOpen ? null : idx)}
                  className="w-full p-4 flex items-center justify-between text-xs font-bold text-slate-700 hover:text-slate-850 hover:bg-slate-50/30 transition-all text-left cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transform transition-transform duration-300 ${isOpen ? 'rotate-180 text-farm-650' : ''}`} />
                </button>
                {isOpen && (
                  <div className="p-4 pt-0 border-t border-slate-50 text-[11px] font-medium text-slate-500 leading-relaxed bg-slate-50/20">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

    </div>
  );
};
export default Contact;
