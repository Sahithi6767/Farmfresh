import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Tractor, Users, Landmark, Droplets, Leaf } from 'lucide-react';

export const About = () => {
  return (
    <div className="space-y-16 pb-12">
      
      {/* Hero Header */}
      <section className="text-center max-w-2xl mx-auto space-y-4">
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-farm-100 text-farm-800 text-xs font-bold uppercase tracking-wider">
          🌱 Our Family Farm Story
        </span>
        <h1 className="text-3xl md:text-5xl font-display font-black text-slate-900 leading-tight">
          Grown Naturally, <br />
          <span className="text-farm-600">Sold Honestly.</span>
        </h1>
        <p className="text-slate-500 font-medium text-sm leading-relaxed">
          FarmFresh was built to give the Reddy family farm a direct line to customers across India. We grow only what we can store and ship safely — turmeric, mangoes, and rice. No middlemen, no cold-chain dependencies, just clean organic food from Bhupathipur, Jagtial.
        </p>
      </section>

      {/* Legacy Farm Spotlight: Thirupathi Reddy */}
      <section className="bg-slate-900 text-white rounded-3xl p-8 md:p-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center shadow-xl">
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold">
            <Landmark className="w-3.5 h-3.5" /> Bhupathipur, Jagtial — Telangana
          </div>
          <h2 className="text-3xl md:text-4xl font-display font-bold">Thirupathi Reddy & Family</h2>
          <p className="text-slate-300 text-xs md:text-sm leading-relaxed">
            For over four decades, Thirupathi Reddy and his family have cultivated the fertile red soil of Bhupathipur village in Jagtial district, Telangana. Their 25-acre farm sits close to the Godavari basin — a region blessed with mineral-rich water and ideal weather for growing turmeric, mangoes and rice.
          </p>
          <p className="text-slate-400 text-xs leading-relaxed">
            The farm strictly avoids synthetic fertilizers and chemical pesticides. Instead, the family uses natural vermicompost, cow dung manure, and traditional crop rotation techniques passed down through generations. Because they cannot guarantee same-day delivery for perishable items to distant cities, the Reddys made a conscious decision — <strong className="text-white">only grow what stores well</strong>. That's why every product on FarmFresh from this farm is a storable, long-shelf-life item with uncompromised freshness.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
            <div className="bg-white/5 border border-white/10 p-3 rounded-2xl">
              <span className="text-[10px] text-slate-400 block font-bold">FARM SIZE</span>
              <span className="text-base font-bold text-emerald-300 mt-0.5">25 Acres</span>
            </div>
            <div className="bg-white/5 border border-white/10 p-3 rounded-2xl">
              <span className="text-[10px] text-slate-400 block font-bold">LOCATION</span>
              <span className="text-base font-bold text-emerald-300 mt-0.5">Jagtial, TG</span>
            </div>
            <div className="bg-white/5 border border-white/10 p-3 rounded-2xl">
              <span className="text-[10px] text-slate-400 block font-bold">PRIMARY CROPS</span>
              <span className="text-base font-bold text-emerald-300 mt-0.5">Turmeric & Rice</span>
            </div>
            <div className="bg-white/5 border border-white/10 p-3 rounded-2xl col-span-2 md:col-span-1">
              <span className="text-[10px] text-slate-400 block font-bold">SEASON MANGOES</span>
              <span className="text-base font-bold text-emerald-300 mt-0.5">Banganapalle</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5">
          <img
            src="https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&q=80&w=600"
            alt="Thirupathi Reddy family farm harvest"
            className="rounded-2xl shadow-lg w-full h-[280px] object-cover border border-white/10"
          />
        </div>
      </section>

      {/* What We Grow Section */}
      <section className="space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-1">
          <h2 className="text-2xl font-display font-black text-slate-800">Our Three Core Crops</h2>
          <p className="text-xs text-slate-400 font-medium">Carefully chosen for their shelf life and quality when shipped across India</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Turmeric */}
          <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-xs">
            <img
              src="https://images.unsplash.com/photo-1615485500704-8e3b96ef9726?auto=format&fit=crop&q=80&w=600"
              alt="Turmeric from Reddy Farms"
              className="w-full h-40 object-cover"
            />
            <div className="p-5 space-y-2">
              <h3 className="font-display font-bold text-slate-800 text-base">Turmeric — Our Specialty</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                Jagtial's red soil produces turmeric with naturally high curcumin content (3.5%+). We sell both whole dried fingers (shelf life 3+ years) and stone-ground powder (2+ years). Our haldi is free from synthetic colours and flow agents.
              </p>
            </div>
          </div>

          {/* Mangoes */}
          <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-xs">
            <img
              src="https://images.unsplash.com/photo-1591073113125-e46713c829ed?auto=format&fit=crop&q=80&w=600"
              alt="Banganapalle mangoes"
              className="w-full h-40 object-cover"
            />
            <div className="p-5 space-y-2">
              <h3 className="font-display font-bold text-slate-800 text-base">Mangoes — Seasonal GI Harvest</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                We grow Banganapalle (Benishan) mangoes — the iconic GI-tagged variety from Telangana. Available only May–June each year. Tree-ripened naturally without any calcium carbide or chemical agents. Sweet, fibre-free pulp loved across South India.
              </p>
            </div>
          </div>

          {/* Rice */}
          <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-xs">
            <img
              src="https://images.unsplash.com/photo-1536304993881-ff86e0c9b8b0?auto=format&fit=crop&q=80&w=600"
              alt="Sona Masuri rice harvest"
              className="w-full h-40 object-cover"
            />
            <div className="p-5 space-y-2">
              <h3 className="font-display font-bold text-slate-800 text-base">Rice — Telangana Native Varieties</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                We grow Sona Masuri (HMT), the premium medium-grain variety native to Telangana. Also available as unpolished brown rice for health-conscious buyers. Irrigated using Godavari canal water, milled at our local unit and stored in airtight packaging.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* Sustainable standards grid */}
      <section className="space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-1">
          <h2 className="text-2xl font-display font-black text-slate-800">Why We Only Ship Storable Items</h2>
          <p className="text-xs text-slate-400 font-medium">A deliberate choice that keeps quality high and waste zero</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-xs space-y-4">
            <div className="bg-emerald-50 text-emerald-600 p-3 rounded-2xl inline-block">
              <Droplets className="w-6 h-6" />
            </div>
            <h3 className="font-display font-bold text-slate-800 text-base">No Cold-Chain Required</h3>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">
              Turmeric powder, dried turmeric, and rice don't require refrigeration. They can be shipped across India in 2-4 days without any quality loss — making direct farm trade actually viable without cold-storage infrastructure.
            </p>
          </div>

          <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-xs space-y-4">
            <div className="bg-emerald-50 text-emerald-600 p-3 rounded-2xl inline-block">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-display font-bold text-slate-800 text-base">Zero Wastage</h3>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">
              Unlike vegetables or dairy, our products have shelf lives ranging from 10 days (mangoes) to over 3 years (dried turmeric). This means zero food waste, controlled harvest batches, and reliable supply for customers year-round.
            </p>
          </div>

          <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-xs space-y-4">
            <div className="bg-emerald-50 text-emerald-600 p-3 rounded-2xl inline-block">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="font-display font-bold text-slate-800 text-base">Direct Farmer Pricing</h3>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">
              The Reddy family earns over 80% of your purchase price directly. No APMC mandis, no broker commissions, no aggregator markups. Every rupee you spend here genuinely benefits the family that grew your food.
            </p>
          </div>

        </div>
      </section>

      {/* CTA section */}
      <section className="bg-farm-50 border border-farm-100 rounded-3xl p-8 md:p-12 text-center max-w-3xl mx-auto space-y-6">
        <h2 className="text-2xl font-display font-black text-slate-800">Support Thirupathi Reddy's Family Farm</h2>
        <p className="text-xs text-slate-500 leading-relaxed max-w-md mx-auto font-medium">
          Whether ordering our aromatic turmeric powder, seasonal Banganapalle mangoes, or everyday Sona Masuri rice — you're directly helping a family farm in Bhupathipur continue honest, organic agriculture.
        </p>
        <Link
          to="/products"
          className="inline-block bg-farm-600 hover:bg-farm-700 text-white font-bold px-8 py-3.5 rounded-2xl shadow-md transition-colors"
        >
          Browse Farm Products
        </Link>
      </section>

    </div>
  );
};
export default About;
