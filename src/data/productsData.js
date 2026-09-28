// All products are storable items only — grown at Thirupathi Reddy's family farm
// in Bhupathipur, Jagtial, Telangana (25 acres)

const FAMILY_FARMER = {
  name: 'Thirupathi Reddy',
  farmName: 'Reddy Organic Farms',
  location: 'Bhupathipur, Jagtial, Telangana',
  distanceKm: 38,
  rating: 5.0,
  avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=150',
  story: 'The Thirupathi Reddy family has been cultivating their 25-acre farm in the fertile lands of Jagtial, Telangana for over 40 years. Using natural vermicompost, traditional organic manure, and rainwater harvesting, we grow only what we can deliver safely and freshly — turmeric, mangoes, and rice. No chemicals. No middlemen. Only honest farming.'
};

export const productsData = [
  {
    id: 'reddy-turmeric-powder',
    name: 'Pure Turmeric Powder (Haldi)',
    category: 'Spices & Turmeric',
    price: 195,
    originalPrice: 250,
    unit: '500g Resealable Pack',
    rating: 4.9,
    reviewsCount: 213,
    image: 'https://images.unsplash.com/photo-1615485500704-8e3b96ef9726?auto=format&fit=crop&q=80&w=600',
    organic: true,
    bestseller: true,
    tags: ['High Curcumin', 'Stone-Ground', 'Family Farm Special'],
    farmer: FAMILY_FARMER,
    harvestDate: 'March 2026',
    shelfLifeDays: 730,
    nutrients: {
      curcumin: '3.5% (High Grade)',
      iron: '41mg per 100g',
      fiber: '21g per 100g',
      antioxidants: 'Very High'
    },
    description: 'Stone-ground from our own turmeric roots grown in the red loam soils of Jagtial. Our turmeric is known for its deep amber-orange colour and naturally high curcumin content (3.5%+), far exceeding mass-market brands. Sun-dried then stone-milled — no synthetic colours or flow agents added. Used across Telangana kitchens for flavour, colour, and Ayurvedic health benefits.'
  },
  {
    id: 'reddy-dried-turmeric',
    name: 'Whole Dried Turmeric Fingers',
    category: 'Spices & Turmeric',
    price: 145,
    originalPrice: 190,
    unit: '500g Pack',
    rating: 4.8,
    reviewsCount: 118,
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=600',
    organic: true,
    bestseller: false,
    tags: ['Whole Fingers', 'Sun-Dried', 'Raw & Natural'],
    farmer: FAMILY_FARMER,
    harvestDate: 'March 2026',
    shelfLifeDays: 1095,
    nutrients: {
      curcumin: '3.2% concentration',
      moisture: 'Less than 10%',
      purity: '100% Natural',
      form: 'Whole finger rhizomes'
    },
    description: 'Whole dried turmeric fingers (rhizomes) harvested from our 25-acre farm in Bhupathipur. Naturally sun-dried for 15-20 days on elevated cots to achieve low moisture and maximum shelf life. Ideal for home grinding, milk preparations (golden milk), religious rituals, and long-term storage. Each batch is hand-sorted for quality.'
  },
  {
    id: 'reddy-banganapalle-mangoes',
    name: 'Banganapalle Mangoes (Benishan)',
    category: 'Fruits',
    price: 280,
    originalPrice: 350,
    unit: '1 Dozen (approx 2.5 kg)',
    rating: 4.9,
    reviewsCount: 176,
    image: 'https://images.unsplash.com/photo-1591073113125-e46713c829ed?auto=format&fit=crop&q=80&w=600',
    organic: true,
    bestseller: true,
    tags: ['GI Tagged', 'No Ripening Agents', 'Family Farm Special'],
    farmer: FAMILY_FARMER,
    harvestDate: 'May - June (Seasonal)',
    shelfLifeDays: 10,
    nutrients: {
      calories: '60 kcal per 100g',
      vitaminC: '36mg (40% DV)',
      vitaminA: '1082 IU',
      fiber: '1.6g per 100g'
    },
    description: 'Naturally tree-ripened Banganapalle mangoes, the iconic GI-tagged variety from Telangana. Grown on our farm without any calcium carbide or ethylene ripening agents. Known for their oval shape, thin golden-yellow skin, and exceptionally sweet, fibre-free pulp. Harvested during peak summer at Bhupathipur and dispatched same-day within delivery range.'
  },
  {
    id: 'reddy-sona-masuri-rice',
    name: 'Sona Masuri Raw Rice (HMT)',
    category: 'Grains',
    price: 90,
    originalPrice: 115,
    unit: '1 kg',
    rating: 4.8,
    reviewsCount: 143,
    image: 'https://images.unsplash.com/photo-1536304993881-ff86e0c9b8b0?auto=format&fit=crop&q=80&w=600',
    organic: true,
    bestseller: true,
    tags: ['Telangana Native', 'Low GI', 'Farm Direct'],
    farmer: FAMILY_FARMER,
    harvestDate: 'December 2025',
    shelfLifeDays: 540,
    nutrients: {
      calories: '120 kcal per 100g cooked',
      carbs: '26g',
      protein: '2.5g',
      fat: '0.2g'
    },
    description: 'Freshly-milled Sona Masuri (HMT) rice, a premium medium-grain variety native to Telangana and Andhra Pradesh. Known for its lightweight, lower starch content, and soft texture when cooked — ideal for daily meals, kanji, and biriyanis. Grown on our farm in Bhupathipur using sustainable irrigation from the Godavari basin canals. Stored in airtight jute + polyliner bags.'
  },
  {
    id: 'reddy-unpolished-brown-rice',
    name: 'Unpolished Brown Rice (Kaikuttu)',
    category: 'Grains',
    price: 115,
    originalPrice: 145,
    unit: '1 kg',
    rating: 4.7,
    reviewsCount: 89,
    image: 'https://images.unsplash.com/photo-1627485937980-221c88ac04f9?auto=format&fit=crop&q=80&w=600',
    organic: true,
    bestseller: false,
    tags: ['Unpolished', 'High Fiber', 'Diabetic Friendly'],
    farmer: FAMILY_FARMER,
    harvestDate: 'December 2025',
    shelfLifeDays: 365,
    nutrients: {
      calories: '112 kcal per 100g cooked',
      fiber: '3.5g',
      magnesium: '84mg',
      protein: '2.6g'
    },
    description: 'Hand-pounded unpolished brown rice with the bran layer intact, retaining all natural vitamins, minerals, and dietary fibre. A healthier alternative to polished white rice — recommended for diabetic diets. Grown organically in our fields and minimally processed at our local mill, preserving maximum nutrition. Rich in magnesium, phosphorus, and antioxidants.'
  },
  {
    id: 'reddy-organic-corn',
    name: 'Organic Dried Corn Kernels',
    category: 'Grains',
    price: 80,
    originalPrice: 100,
    unit: '1 kg Pack',
    rating: 4.6,
    reviewsCount: 75,
    image: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&q=80&w=600',
    organic: true,
    bestseller: false,
    tags: ['Whole Grain', 'Fiber Rich', 'Non-GMO'],
    farmer: FAMILY_FARMER,
    harvestDate: 'January 2026',
    shelfLifeDays: 365,
    nutrients: {
      calories: '365 kcal per 100g',
      carbs: '74g',
      protein: '9g',
      fiber: '7g'
    },
    description: 'Premium whole dried yellow corn kernels grown on the sunny fields of Reddy Organic Farms. High in dietary fiber, essential vitamins, and minerals. Perfect for preparing homemade popcorn, corn meal (makki ka atta), or boiling/steaming after soaking. Dried naturally under direct sunlight.'
  },
  {
    id: 'reddy-toor-dal',
    name: 'Organic Toor Dal (Arhar Dal)',
    category: 'Dals & Pulses',
    price: 160,
    originalPrice: 195,
    unit: '1 kg Pack',
    rating: 4.85,
    reviewsCount: 162,
    image: 'https://images.unsplash.com/photo-1547058886-f33f9a722885?auto=format&fit=crop&q=80&w=600',
    organic: true,
    bestseller: true,
    tags: ['Protein Rich', 'Unpolished', 'Daily Staple'],
    farmer: FAMILY_FARMER,
    harvestDate: 'February 2026',
    shelfLifeDays: 365,
    nutrients: {
      protein: '22g per 100g',
      fiber: '15g',
      iron: '2.7mg',
      calories: '343 kcal'
    },
    description: 'Premium unpolished Toor Dal (Split Pigeon Peas) sourced straight from Reddy Farms in Jagtial. Highly nutritious, rich in plant-based proteins, and free from any oil, leather, or water polishing. Cooks easily, yielding a rich, buttery consistency perfect for comforting daily tadka dals.'
  },
  {
    id: 'reddy-moong-dal',
    name: 'Organic Split Moong Dal (Yellow)',
    category: 'Dals & Pulses',
    price: 150,
    originalPrice: 180,
    unit: '1 kg Pack',
    rating: 4.8,
    reviewsCount: 124,
    image: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&q=80&w=600',
    organic: true,
    bestseller: false,
    tags: ['Easy to Digest', 'Unpolished', 'Low Fat'],
    farmer: FAMILY_FARMER,
    harvestDate: 'February 2026',
    shelfLifeDays: 365,
    nutrients: {
      protein: '24g per 100g',
      fiber: '16g',
      folate: '60% DV',
      calories: '347 kcal'
    },
    description: 'Split and dehusked yellow Moong Dal grown with sustainable organic practices. Characterized by its light, quick-cooking nature and easy digestibility. Recommended for khichdi, child nutrition, and light recovery diets. Milled traditionally without any added chemical colors.'
  },
  {
    id: 'reddy-chana-dal',
    name: 'Organic Chana Dal (Split Bengal Gram)',
    category: 'Dals & Pulses',
    price: 120,
    originalPrice: 150,
    unit: '1 kg Pack',
    rating: 4.75,
    reviewsCount: 96,
    image: 'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?auto=format&fit=crop&q=80&w=600',
    organic: true,
    bestseller: false,
    tags: ['Low GI', 'Zinc Rich', 'Unpolished'],
    farmer: FAMILY_FARMER,
    harvestDate: 'January 2026',
    shelfLifeDays: 365,
    nutrients: {
      protein: '20g per 100g',
      fiber: '18g',
      iron: '4.3mg',
      calories: '364 kcal'
    },
    description: 'Nutritious split Chana Dal grown under rain-fed conditions on our farm. Possesses a delicious nutty flavor and retains its shape well after cooking. High in fiber, low in glycemic index, and ideal for diabetic diets, curries, and pakoras.'
  },
  {
    id: 'reddy-urad-dal',
    name: 'Organic Split Urad Dal (Black Gram)',
    category: 'Dals & Pulses',
    price: 140,
    originalPrice: 170,
    unit: '1 kg Pack',
    rating: 4.7,
    reviewsCount: 110,
    image: 'https://images.unsplash.com/photo-1626132647523-66f5bf380027?auto=format&fit=crop&q=80&w=600',
    organic: true,
    bestseller: false,
    tags: ['Iron Rich', 'Idli Batter Special', 'Unpolished'],
    farmer: FAMILY_FARMER,
    harvestDate: 'February 2026',
    shelfLifeDays: 365,
    nutrients: {
      protein: '25g per 100g',
      calcium: '154mg',
      iron: '6mg',
      calories: '341 kcal'
    },
    description: 'Split black gram (with skin) cultivated organically. Rich in iron, calcium, and dietary fibers. Excellent for making traditional Punjabi dals, dal makhani, and South Indian idli/dosa batters when soaked and ground.'
  },
  {
    id: 'reddy-masoor-dal',
    name: 'Organic Split Masoor Dal (Red)',
    category: 'Dals & Pulses',
    price: 130,
    originalPrice: 160,
    unit: '1 kg Pack',
    rating: 4.8,
    reviewsCount: 134,
    image: 'https://images.unsplash.com/photo-1515942400420-2b98fed1f51b?auto=format&fit=crop&q=80&w=600',
    organic: true,
    bestseller: true,
    tags: ['Quick Cook', 'Fibre Rich', 'Unpolished'],
    farmer: FAMILY_FARMER,
    harvestDate: 'March 2026',
    shelfLifeDays: 365,
    nutrients: {
      protein: '25g per 100g',
      fiber: '11g',
      potassium: '369mg',
      calories: '353 kcal'
    },
    description: 'High-quality Split Red Lentils (Masoor Dal) from our Jagtial farm fields. Cooks incredibly fast (requires no pre-soaking) and turns into a soft, creamy texture. Seasoned with cumin and mustard, it serves as a nutrient-packed protein bowl.'
  }
];

export const categoriesData = [
  { id: 'all', name: 'All Products', icon: 'Leaf' },
  { id: 'Spices & Turmeric', name: 'Turmeric & Spices', icon: 'Sprout' },
  { id: 'Fruits', name: 'Fresh Mangoes', icon: 'Apple' },
  { id: 'Grains', name: 'Rice & Grains', icon: 'Wheat' },
  { id: 'Dals & Pulses', name: 'Dals & Lentils', icon: 'Package' }
];
