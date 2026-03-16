import { useState, useRef, useEffect } from "react";

// ─── AGGREGATED SURVEY DATA ───
const TOWNS = {
  "New Haven":{n:201,rent_median:2150,rent_min:725,rent_max:6000,commute_avg:12.4,safety_avg:3.73,noise_avg:1.59,recommend_avg:4.22,car_needed_pct:40,walkable:7.1,pet_friendly_pct:100,parking_avg:98,own_pct:7,transport:{walk:82,drive:101,bike:11,transit:6},highway:3,pub_transit:4,school:2.5,social:4.5},
  "Hamden":{n:30,rent_median:2200,rent_min:1150,rent_max:4000,commute_avg:19.4,safety_avg:4.5,noise_avg:1.07,recommend_avg:4.7,car_needed_pct:97,walkable:4.9,pet_friendly_pct:100,parking_avg:3,own_pct:47,transport:{drive:29,bike:1},highway:4,pub_transit:2,school:4,social:2.5},
  "Milford":{n:11,rent_median:1800,rent_min:1500,rent_max:3250,commute_avg:21.3,safety_avg:4.82,noise_avg:1.18,recommend_avg:4.73,car_needed_pct:100,walkable:4.9,pet_friendly_pct:100,parking_avg:9,own_pct:45,transport:{drive:11},highway:4.5,pub_transit:2,school:4.5,social:3},
  "West Haven":{n:8,rent_median:1700,rent_min:1400,rent_max:3000,commute_avg:17.4,safety_avg:4.0,noise_avg:1.5,recommend_avg:4.12,car_needed_pct:100,walkable:5.4,pet_friendly_pct:100,parking_avg:0,own_pct:25,transport:{drive:8},highway:4,pub_transit:2.5,school:3,social:2.5},
  "Branford":{n:8,rent_median:4000,rent_min:1650,rent_max:5000,commute_avg:17.4,safety_avg:4.75,noise_avg:1.0,recommend_avg:4.5,car_needed_pct:100,walkable:3.0,pet_friendly_pct:100,parking_avg:0,own_pct:25,transport:{drive:8},highway:4.5,pub_transit:2,school:4.5,social:2},
  "East Haven":{n:7,rent_median:2300,rent_min:1100,rent_max:4100,commute_avg:15.3,safety_avg:4.86,noise_avg:1.0,recommend_avg:4.14,car_needed_pct:100,walkable:2.4,pet_friendly_pct:100,parking_avg:9,own_pct:43,transport:{drive:7},highway:4.5,pub_transit:2,school:3.5,social:1.5},
  "Cheshire":{n:6,rent_median:3500,rent_min:1900,rent_max:4300,commute_avg:34.2,safety_avg:5.0,noise_avg:1.0,recommend_avg:4.33,car_needed_pct:100,walkable:3.2,pet_friendly_pct:100,parking_avg:0,own_pct:67,transport:{drive:6},highway:4,pub_transit:1,school:5,social:1},
  "North Haven":{n:5,rent_median:3000,rent_min:1200,rent_max:4000,commute_avg:21.0,safety_avg:4.8,noise_avg:1.2,recommend_avg:3.8,car_needed_pct:100,walkable:2.4,pet_friendly_pct:100,parking_avg:0,own_pct:40,transport:{drive:5},highway:4.5,pub_transit:1.5,school:4,social:1.5},
  "Fairfield":{n:4,rent_median:4000,rent_min:3200,rent_max:4500,commute_avg:42.5,safety_avg:5.0,noise_avg:1.25,recommend_avg:4.25,car_needed_pct:100,walkable:3.0,pet_friendly_pct:100,parking_avg:138,own_pct:0,transport:{drive:4},highway:4,pub_transit:2,school:5,social:3},
  "Derby":{n:3,rent_median:3800,rent_min:1800,rent_max:3900,commute_avg:21.7,safety_avg:4.33,noise_avg:1.0,recommend_avg:3.67,car_needed_pct:100,walkable:2.3,pet_friendly_pct:100,parking_avg:0,own_pct:67,transport:{drive:3},highway:4,pub_transit:1,school:3.5,social:1},
  "Orange":{n:3,rent_median:4000,rent_min:2800,rent_max:4600,commute_avg:15.3,safety_avg:5.0,noise_avg:1.33,recommend_avg:4.67,car_needed_pct:100,walkable:2.3,pet_friendly_pct:100,parking_avg:0,own_pct:67,transport:{drive:3},highway:4.5,pub_transit:1,school:5,social:1},
  "Guilford":{n:2,rent_median:3800,rent_min:2500,rent_max:3800,commute_avg:27.5,safety_avg:5.0,noise_avg:1.0,recommend_avg:5.0,car_needed_pct:100,walkable:6.0,pet_friendly_pct:100,parking_avg:0,own_pct:100,transport:{drive:2},highway:4,pub_transit:1.5,school:5,social:2},
  "Wallingford":{n:2,rent_median:2400,rent_min:2400,rent_max:2400,commute_avg:18.5,safety_avg:5.0,noise_avg:1.0,recommend_avg:5.0,car_needed_pct:100,walkable:1.5,pet_friendly_pct:100,parking_avg:0,own_pct:50,transport:{drive:2},highway:4.5,pub_transit:1.5,school:4.5,social:1},
  "Meriden":{n:2,rent_median:2900,rent_min:1350,rent_max:2900,commute_avg:27.5,safety_avg:4.0,noise_avg:1.0,recommend_avg:3.0,car_needed_pct:100,walkable:4.5,pet_friendly_pct:100,parking_avg:0,own_pct:50,transport:{drive:2},highway:4.5,pub_transit:2.5,school:3,social:2},
};

const NEIGHBORHOODS = {
  "Downtown":{n:93,rent_median:2200,rent_min:1000,rent_max:4500,commute_avg:10.7,safety_avg:3.48,noise_avg:1.87,recommend_avg:4.04,car_needed_pct:24,walkable:7.3,pet_friendly_pct:100,parking_avg:132,transport:{walk:65,drive:27,bike:1},highway:2.5,pub_transit:5,school:2,social:5},
  "East Rock":{n:36,rent_median:1950,rent_min:850,rent_max:6000,commute_avg:13.1,safety_avg:4.47,noise_avg:1.19,recommend_avg:4.78,car_needed_pct:53,walkable:8.0,pet_friendly_pct:100,parking_avg:35,transport:{bike:6,drive:27,transit:3},highway:3,pub_transit:3.5,school:3.5,social:3.5},
  "Westville":{n:19,rent_median:2200,rent_min:725,rent_max:3700,commute_avg:13.1,safety_avg:4.0,noise_avg:1.37,recommend_avg:4.05,car_needed_pct:94,walkable:5.8,pet_friendly_pct:100,parking_avg:31,transport:{drive:19},highway:4,pub_transit:2.5,school:3.5,social:2.5},
  "Wooster Square":{n:17,rent_median:2250,rent_min:1050,rent_max:4500,commute_avg:11.1,safety_avg:4.06,noise_avg:1.41,recommend_avg:4.71,car_needed_pct:25,walkable:8.7,pet_friendly_pct:100,parking_avg:134,transport:{drive:12,walk:2,bike:2},highway:3.5,pub_transit:4,school:3,social:4},
  "The Hill":{n:13,rent_median:2147,rent_min:1000,rent_max:3800,commute_avg:16.9,safety_avg:3.46,noise_avg:1.62,recommend_avg:4.0,car_needed_pct:50,walkable:6.4,pet_friendly_pct:100,parking_avg:91,transport:{walk:9,drive:4},highway:4,pub_transit:3,school:2.5,social:2.5},
  "Newhallville":{n:5,rent_median:2500,rent_min:1800,rent_max:3092,commute_avg:14.6,safety_avg:3.2,noise_avg:1.8,recommend_avg:3.2,car_needed_pct:40,walkable:4.0,pet_friendly_pct:100,parking_avg:135,transport:{drive:4,walk:1},highway:3.5,pub_transit:3,school:2,social:2},
  "Dwight":{n:4,rent_median:2080,rent_min:1060,rent_max:2100,commute_avg:16.8,safety_avg:3.75,noise_avg:1.5,recommend_avg:4.5,car_needed_pct:50,walkable:5.5,pet_friendly_pct:100,parking_avg:0,transport:{bike:1,transit:1,walk:2},highway:3,pub_transit:3.5,school:2.5,social:3},
  "Edgewood":{n:3,rent_median:1500,rent_min:1500,rent_max:2150,commute_avg:14.0,safety_avg:2.0,noise_avg:1.33,recommend_avg:4.33,car_needed_pct:33,walkable:7.7,pet_friendly_pct:100,parking_avg:0,transport:{walk:2,drive:1},highway:3.5,pub_transit:3,school:3,social:3},
  "Dixwell":{n:3,rent_median:1750,rent_min:1700,rent_max:2250,commute_avg:22.8,safety_avg:2.67,noise_avg:1.0,recommend_avg:3.33,car_needed_pct:33,walkable:4.3,pet_friendly_pct:100,parking_avg:150,transport:{transit:2,bike:1},highway:3,pub_transit:3.5,school:2,social:2},
  "Prospect Hill":{n:2,rent_median:2400,rent_min:1970,rent_max:2400,commute_avg:10.0,safety_avg:3.5,noise_avg:1.5,recommend_avg:4.0,car_needed_pct:0,walkable:7.0,pet_friendly_pct:100,parking_avg:0,transport:{drive:2},highway:2.5,pub_transit:3.5,school:2.5,social:3.5},
  "East Shore":{n:2,rent_median:2000,rent_min:1100,rent_max:2000,commute_avg:13.5,safety_avg:5.0,noise_avg:1.5,recommend_avg:4.0,car_needed_pct:100,walkable:3.5,pet_friendly_pct:100,parking_avg:0,transport:{drive:2},highway:4,pub_transit:2,school:3.5,social:1.5},
};

const APARTMENTS = {
  "Pierpont (City Crossing)":{addr:"9 Tower Ln",n:7,hood:"The Hill",town:"New Haven",rent_median:2700,rent_min:1800,rent_max:3800,rating:4.71,commute_avg:26.8,safety_avg:3.14,noise_avg:1.43,recommend:4.0,pet_pct:100,parking_avg:175,car_pct:60,landlord:4.86},
  "College and Crown":{addr:"200 College St",n:7,hood:"Downtown",town:"New Haven",rent_median:2434,rent_min:2100,rent_max:3300,rating:4.57,commute_avg:10.0,safety_avg:4.0,noise_avg:2.0,recommend:4.29,pet_pct:100,parking_avg:143,car_pct:0,landlord:4.57},
  "Corsair":{addr:"1050 State St",n:5,hood:"Downtown",town:"New Haven",rent_median:2700,rent_min:1800,rent_max:4500,rating:4.8,commute_avg:11.3,safety_avg:4.2,noise_avg:1.6,recommend:4.6,pet_pct:100,parking_avg:80,car_pct:60,landlord:5.0},
  "Olive & Wooster":{addr:"87 Union St",n:4,hood:"Wooster Square",town:"New Haven",rent_median:3479,rent_min:1650,rent_max:4500,rating:4.75,commute_avg:8.2,safety_avg:4.0,noise_avg:2.0,recommend:4.5,pet_pct:100,parking_avg:175,car_pct:0,landlord:4.5},
  "Mason (City Crossing)":{addr:"188 Lafayette St",n:4,hood:"Downtown",town:"New Haven",rent_median:2450,rent_min:1750,rent_max:2500,rating:4.5,commute_avg:7.8,safety_avg:3.75,noise_avg:1.25,recommend:4.5,pet_pct:100,parking_avg:150,car_pct:0,landlord:4.75},
  "The Novella":{addr:"1245 Chapel St",n:4,hood:"Downtown",town:"New Haven",rent_median:2100,rent_min:2050,rent_max:2500,rating:4.5,commute_avg:9.8,safety_avg:4.0,noise_avg:1.5,recommend:4.25,pet_pct:100,parking_avg:200,car_pct:25,landlord:5.0},
  "The Audubon":{addr:"367 Orange St",n:4,hood:"Downtown",town:"New Haven",rent_median:3500,rent_min:2150,rent_max:3550,rating:4.25,commute_avg:10.5,safety_avg:4.5,noise_avg:1.25,recommend:5.0,pet_pct:100,parking_avg:135,car_pct:67,landlord:4.5},
  "Anthem Square 10":{addr:"20 George St",n:7,hood:"Downtown",town:"New Haven",rent_median:2600,rent_min:1500,rent_max:2800,rating:4.43,commute_avg:10.1,safety_avg:3.57,noise_avg:1.71,recommend:4.29,pet_pct:100,parking_avg:138,car_pct:14,landlord:4.14},
  "Curio 269":{addr:"269 Orange St",n:3,hood:"Downtown",town:"New Haven",rent_median:1889,rent_min:1600,rent_max:2600,rating:4.67,commute_avg:6.5,safety_avg:4.33,noise_avg:1.67,recommend:4.67,pet_pct:100,parking_avg:161,car_pct:67,landlord:4.67},
  "Metro on Crown":{addr:"274 Crown St",n:2,hood:"Downtown",town:"New Haven",rent_median:2831,rent_min:1500,rent_max:2831,rating:5.0,commute_avg:10.0,safety_avg:3.5,noise_avg:1.5,recommend:5.0,pet_pct:100,parking_avg:168,car_pct:0,landlord:5.0},
  "360 State":{addr:"360 State St",n:8,hood:"Downtown",town:"New Haven",rent_median:2400,rent_min:1600,rent_max:3700,rating:4.12,commute_avg:13.9,safety_avg:3.5,noise_avg:1.88,recommend:4.25,pet_pct:100,parking_avg:141,car_pct:25,landlord:4.0},
  "Madison Tower":{addr:"111 Park St",n:10,hood:"Downtown",town:"New Haven",rent_median:2100,rent_min:1745,rent_max:2400,rating:3.6,commute_avg:7.5,safety_avg:3.4,noise_avg:1.7,recommend:4.2,pet_pct:100,parking_avg:87,car_pct:20,landlord:3.9},
  "Crown Court":{addr:"129 York St",n:4,hood:"Downtown",town:"New Haven",rent_median:2045,rent_min:1960,rent_max:2200,rating:4.25,commute_avg:9.0,safety_avg:3.0,noise_avg:2.33,recommend:3.5,pet_pct:100,parking_avg:133,car_pct:25,landlord:3.75},
  "Residence Court":{addr:"900 Chapel St",n:8,hood:"Downtown",town:"New Haven",rent_median:2200,rent_min:1000,rent_max:2500,rating:3.75,commute_avg:14.0,safety_avg:2.62,noise_avg:2.38,recommend:3.62,pet_pct:100,parking_avg:173,car_pct:12,landlord:3.38},
  "925 at North":{addr:"925 Mix Ave, Hamden",n:3,hood:null,town:"Hamden",rent_median:2000,rent_min:1895,rent_max:2350,rating:4.33,commute_avg:27.5,safety_avg:4.0,noise_avg:1.0,recommend:4.67,pet_pct:100,parking_avg:0,car_pct:100,landlord:4.0},
  "Town Walk":{addr:"100 Town Walk Dr, Hamden",n:2,hood:null,town:"Hamden",rent_median:2200,rent_min:2200,rent_max:2200,rating:4.5,commute_avg:20.0,safety_avg:4.5,noise_avg:1.5,recommend:5.0,pet_pct:100,parking_avg:60,car_pct:100,landlord:4.5},
  "Canal Crossing":{addr:"380 Mather St, Hamden",n:2,hood:null,town:"Hamden",rent_median:2300,rent_min:2015,rent_max:2300,rating:4.5,commute_avg:20.0,safety_avg:4.0,noise_avg:1.0,recommend:5.0,pet_pct:100,parking_avg:0,car_pct:50,landlord:5.0},
  "The Archive":{addr:"848 Chapel St",n:2,hood:"Downtown",town:"New Haven",rent_median:2300,rent_min:1990,rent_max:2300,rating:4.5,commute_avg:11.5,safety_avg:3.0,noise_avg:2.5,recommend:3.0,pet_pct:100,parking_avg:100,car_pct:0,landlord:4.5},
  "Axis 201":{addr:"201 Munson St",n:7,hood:"Newhallville",town:"New Haven",rent_median:2400,rent_min:1700,rent_max:3092,rating:3.57,commute_avg:19.4,safety_avg:3.0,noise_avg:1.57,recommend:3.14,pet_pct:100,parking_avg:140,car_pct:43,landlord:3.86},
  "Westville Village":{addr:"400 Blake St",n:5,hood:"Westville",town:"New Haven",rent_median:2200,rent_min:1800,rent_max:2500,rating:2.6,commute_avg:15.4,safety_avg:2.75,noise_avg:2.0,recommend:2.4,pet_pct:100,parking_avg:64,car_pct:100,landlord:3.0},
  "Crown Towers":{addr:"123 York St",n:5,hood:"Downtown",town:"New Haven",rent_median:2300,rent_min:2100,rent_max:2508,rating:2.4,commute_avg:9.4,safety_avg:2.6,noise_avg:1.8,recommend:3.0,pet_pct:100,parking_avg:138,car_pct:80,landlord:2.6},
  "The Whit":{addr:"630 Chapel St",n:2,hood:"Wooster Square",town:"New Haven",rent_median:3000,rent_min:1945,rent_max:3000,rating:4.0,commute_avg:15.0,safety_avg:3.5,noise_avg:2.0,recommend:4.0,pet_pct:100,parking_avg:185,car_pct:0,landlord:4.0},
};

// ─── SCORING ENGINE ───
function scoreLocation(loc, answers) {
  let score = 0;
  let maxScore = 0;
  const weights = answers.priorities || {};

  // Cost scoring
  const w_cost = (weights.cost || 3);
  maxScore += w_cost * 10;
  if (answers.budget && loc.rent_median) {
    if (loc.rent_median <= answers.budget) {
      score += w_cost * 10;
    } else if (loc.rent_median <= answers.budget * 1.15) {
      score += w_cost * 6;
    } else if (loc.rent_median <= answers.budget * 1.3) {
      score += w_cost * 3;
    }
    // Bonus if min rent is within budget
    if (loc.rent_min && loc.rent_min <= answers.budget) {
      score += w_cost * 2;
      maxScore += w_cost * 2;
    } else {
      maxScore += w_cost * 2;
    }
  }

  // Safety
  const w_safety = (weights.safety || 3);
  maxScore += w_safety * 10;
  if (loc.safety_avg) {
    score += w_safety * (loc.safety_avg / 5) * 10;
  }

  // Commute length
  const w_commute = (weights.commute || 3);
  maxScore += w_commute * 10;
  if (loc.commute_avg != null) {
    const commScore = Math.max(0, 10 - (loc.commute_avg / 5));
    score += w_commute * commScore;
  }

  // Space - favor locations where rent gets more space (lower rent = more space per dollar)
  const w_space = (weights.space || 3);
  maxScore += w_space * 10;
  if (answers.livingWith === "partner_kids") {
    // Families need suburban towns with more space
    if (loc.own_pct && loc.own_pct > 30) score += w_space * 7;
    else if (loc.noise_avg && loc.noise_avg < 1.3) score += w_space * 5;
    else score += w_space * 3;
  } else {
    score += w_space * 5; // neutral for non-families
  }

  // Parking
  const w_parking = (weights.parking || 3);
  maxScore += w_parking * 10;
  if (loc.parking_avg != null) {
    if (loc.parking_avg === 0) score += w_parking * 10;
    else if (loc.parking_avg < 50) score += w_parking * 8;
    else if (loc.parking_avg < 100) score += w_parking * 6;
    else if (loc.parking_avg < 150) score += w_parking * 4;
    else score += w_parking * 2;
  }

  // Proximity to hospital
  const w_prox = (weights.proximity || 3);
  maxScore += w_prox * 10;
  if (loc.commute_avg != null) {
    if (loc.commute_avg <= 10) score += w_prox * 10;
    else if (loc.commute_avg <= 15) score += w_prox * 8;
    else if (loc.commute_avg <= 20) score += w_prox * 6;
    else if (loc.commute_avg <= 30) score += w_prox * 3;
    else score += w_prox * 1;
  }

  // Quiet
  const w_quiet = (weights.quiet || 3);
  maxScore += w_quiet * 10;
  if (loc.noise_avg) {
    score += w_quiet * ((3 - loc.noise_avg) / 2) * 10;
  }

  // Social / Nightlife
  const w_social = (weights.social || 3);
  maxScore += w_social * 10;
  if (loc.social) {
    score += w_social * (loc.social / 5) * 10;
  } else if (loc.walkable) {
    score += w_social * Math.min(1, loc.walkable / 10) * 10;
  }

  // Pet friendliness
  const w_pet = (weights.pet || 3);
  maxScore += w_pet * 10;
  if (loc.pet_friendly_pct != null || loc.pet_pct != null) {
    const pct = loc.pet_friendly_pct ?? loc.pet_pct ?? 0;
    score += w_pet * (pct / 100) * 10;
  }

  // Highway access
  const w_highway = (weights.highway || 3);
  maxScore += w_highway * 10;
  if (loc.highway) {
    score += w_highway * (loc.highway / 5) * 10;
  }

  // Public transit
  const w_transit = (weights.transit || 3);
  maxScore += w_transit * 10;
  if (loc.pub_transit) {
    score += w_transit * (loc.pub_transit / 5) * 10;
  }

  // School district
  const w_school = (weights.school || 3);
  maxScore += w_school * 10;
  if (loc.school) {
    score += w_school * (loc.school / 5) * 10;
  }

  // Walkability
  const w_walk = (weights.walkability || 3);
  maxScore += w_walk * 10;
  if (loc.walkable) {
    score += w_walk * Math.min(1, loc.walkable / 10) * 10;
  }

  // Commute method compatibility
  if (answers.commuteMethod) {
    const transport = loc.transport || {};
    const total = Object.values(transport).reduce((a,b) => a+b, 0);
    if (total > 0) {
      const methodMap = { walk: "walk", bike: "bike", drive: "drive", transit: "transit" };
      const key = methodMap[answers.commuteMethod];
      const pct = (transport[key] || 0) / total;
      score += 15 * pct; // bonus
      maxScore += 15;
    } else {
      maxScore += 15;
    }
  }

  // Car compatibility
  if (answers.hasCar === false && loc.car_needed_pct != null) {
    const noCar = (100 - loc.car_needed_pct) / 100;
    score += 20 * noCar;
    maxScore += 20;
  } else if (answers.hasCar === true) {
    maxScore += 20;
    score += 20; // everyone works with a car
  }

  // Rent vs Own preference
  if (answers.tenure === "own" && loc.own_pct != null) {
    score += 10 * (loc.own_pct / 100);
    maxScore += 10;
  } else if (answers.tenure === "rent") {
    maxScore += 10;
    if (loc.own_pct != null) score += 10 * ((100 - loc.own_pct) / 100);
  }

  // Recommendation bonus
  if (loc.recommend_avg || loc.recommend) {
    const rec = loc.recommend_avg || loc.recommend;
    score += 5 * (rec / 5);
    maxScore += 5;
  }

  // Rating bonus (apartments)
  if (loc.rating) {
    score += 8 * (loc.rating / 5);
    maxScore += 8;
  }

  return maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;
}

// ─── COMPONENTS ───
const YALE_BLUE = "#00356b";
const YALE_MID = "#286dc0";
const ACCENT = "#63aaff";

const PRIORITY_ITEMS = [
  { key: "commute", label: "Commute Length" },
  { key: "cost", label: "Cost" },
  { key: "safety", label: "Safety" },
  { key: "space", label: "Space" },
  { key: "parking", label: "Parking" },
  { key: "proximity", label: "Proximity to Hospital" },
  { key: "quiet", label: "Quiet" },
  { key: "social", label: "Social / Nightlife" },
  { key: "pet", label: "Pet Friendliness" },
  { key: "highway", label: "Highway Access" },
  { key: "transit", label: "Public Transit Access" },
  { key: "school", label: "School District Quality" },
  { key: "walkability", label: "Walkability" },
];

const BUDGET_OPTIONS = [
  { value: 1200, label: "Under $1,200" },
  { value: 1500, label: "$1,200 – $1,500" },
  { value: 1800, label: "$1,500 – $1,800" },
  { value: 2000, label: "$1,800 – $2,000" },
  { value: 2300, label: "$2,000 – $2,300" },
  { value: 2600, label: "$2,300 – $2,600" },
  { value: 3000, label: "$2,600 – $3,000" },
  { value: 3500, label: "$3,000 – $3,500" },
  { value: 4000, label: "$3,500 – $4,000" },
  { value: 5000, label: "$4,000+" },
];

function StarRating({ value }) {
  return (
    <span style={{ color: "#e8a838", fontSize: 14, letterSpacing: 1 }}>
      {[1,2,3,4,5].map(i => (
        <span key={i} style={{ opacity: i <= Math.round(value) ? 1 : 0.25 }}>★</span>
      ))}
    </span>
  );
}

function ProgressBar({ current, total }) {
  return (
    <div style={{ display: "flex", gap: 4, padding: "0 0 24px" }}>
      {Array.from({ length: total }, (_, i) => (
        <div key={i} style={{
          flex: 1, height: 3, borderRadius: 2,
          background: i <= current ? YALE_BLUE : "#dde3ea",
          transition: "background 0.3s"
        }} />
      ))}
    </div>
  );
}

function OptionCard({ selected, onClick, children, style }) {
  return (
    <button onClick={onClick} style={{
      border: selected ? `2px solid ${YALE_BLUE}` : "2px solid #e2e6eb",
      background: selected ? "#f0f4fa" : "#fff",
      borderRadius: 10, padding: "14px 18px", cursor: "pointer",
      fontFamily: "'Source Serif 4', Georgia, serif", fontSize: 15,
      color: "#1a2332", textAlign: "left", transition: "all 0.15s",
      ...style,
    }}>
      {children}
    </button>
  );
}

function PrioritySlider({ label, value, onChange }) {
  const labels = ["Not Important", "", "Neutral", "", "Very Important"];
  return (
    <div style={{ marginBottom: 18 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
        <span style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: 14, fontWeight: 600, color: "#1a2332" }}>{label}</span>
        <span style={{ fontSize: 12, color: "#7a8696", fontFamily: "monospace" }}>{labels[value - 1] || value}</span>
      </div>
      <input type="range" min={1} max={5} value={value} onChange={e => onChange(Number(e.target.value))}
        style={{ width: "100%", accentColor: YALE_BLUE, cursor: "pointer" }} />
    </div>
  );
}

function ResultCard({ rank, name, type, matchPct, data, isExpanded, onToggle }) {
  const typeColors = { town: "#0d7c66", neighborhood: YALE_MID, apartment: "#8b5cf6" };
  const typeLabels = { town: "Town", neighborhood: "Neighborhood", apartment: "Apartment" };
  return (
    <div style={{
      border: rank === 1 ? `2px solid ${YALE_BLUE}` : "1px solid #e2e6eb",
      borderRadius: 12, overflow: "hidden", marginBottom: 12,
      background: rank === 1 ? "#fafbfd" : "#fff",
      boxShadow: rank === 1 ? "0 2px 12px rgba(0,53,107,0.08)" : "none",
    }}>
      <button onClick={onToggle} style={{
        width: "100%", border: "none", background: "transparent",
        padding: "16px 20px", cursor: "pointer", textAlign: "left",
        display: "flex", alignItems: "center", gap: 14,
      }}>
        <span style={{
          width: 32, height: 32, borderRadius: "50%", display: "flex",
          alignItems: "center", justifyContent: "center", flexShrink: 0,
          background: rank === 1 ? YALE_BLUE : rank <= 3 ? "#e8edf3" : "#f3f5f7",
          color: rank === 1 ? "#fff" : "#4a5568",
          fontFamily: "monospace", fontSize: 14, fontWeight: 700,
        }}>{rank}</span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: 17, fontWeight: 700, color: "#1a2332" }}>{name}</div>
          {data.addr && <div style={{ fontSize: 12, color: "#7a8696", marginTop: 2 }}>{data.addr}</div>}
        </div>
        <span style={{
          fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 20,
          background: typeColors[type] + "18", color: typeColors[type],
          textTransform: "uppercase", letterSpacing: 0.5, flexShrink: 0,
        }}>{typeLabels[type]}</span>
        <div style={{ textAlign: "right", flexShrink: 0 }}>
          <div style={{ fontFamily: "monospace", fontSize: 22, fontWeight: 700, color: YALE_BLUE }}>{matchPct}%</div>
          <div style={{ fontSize: 10, color: "#7a8696", textTransform: "uppercase", letterSpacing: 0.5 }}>match</div>
        </div>
      </button>

      {isExpanded && (
        <div style={{ padding: "0 20px 20px", borderTop: "1px solid #eef1f5" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px 24px", paddingTop: 16, fontSize: 13 }}>
            {data.rent_median && <Stat label="Median Rent" value={`$${data.rent_median.toLocaleString()}/mo`} />}
            {data.rent_min && data.rent_max && <Stat label="Rent Range" value={`$${data.rent_min.toLocaleString()} – $${data.rent_max.toLocaleString()}`} />}
            {data.commute_avg != null && <Stat label="Avg Commute" value={`${data.commute_avg} min`} />}
            {data.safety_avg && <Stat label="Safety" value={<StarRating value={data.safety_avg} />} />}
            {(data.recommend_avg || data.recommend) && <Stat label="Recommendation" value={<StarRating value={data.recommend_avg || data.recommend} />} />}
            {data.rating && <Stat label="Unit Rating" value={<StarRating value={data.rating} />} />}
            {data.noise_avg && <Stat label="Noise Level" value={data.noise_avg <= 1.3 ? "🤫 Quiet" : data.noise_avg <= 2 ? "🔉 Moderate" : "🔊 Loud"} />}
            {data.parking_avg != null && <Stat label="Avg Parking Cost" value={data.parking_avg === 0 ? "Free" : `$${data.parking_avg}/mo`} />}
            {data.walkable && <Stat label="Walkable Amenities" value={`${data.walkable}/10`} />}
            {data.car_needed_pct != null && <Stat label="Car Needed" value={`${data.car_needed_pct}% say yes`} />}
            {data.car_pct != null && <Stat label="Car Needed" value={`${data.car_pct}% say yes`} />}
            {data.pet_friendly_pct != null && <Stat label="Pet Friendly" value={`${data.pet_friendly_pct}%`} />}
            {data.pet_pct != null && <Stat label="Pet Friendly" value={`${data.pet_pct}%`} />}
            {data.landlord && <Stat label="Landlord Responsiveness" value={<StarRating value={data.landlord} />} />}
            {data.n && <Stat label="Survey Responses" value={data.n} />}
            {data.hood && <Stat label="Neighborhood" value={data.hood} />}
            {data.town && type === "apartment" && <Stat label="Town" value={data.town} />}
          </div>
        </div>
      )}
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div>
      <div style={{ fontSize: 11, color: "#7a8696", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 2 }}>{label}</div>
      <div style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontWeight: 600, color: "#1a2332" }}>{value}</div>
    </div>
  );
}


export default function HousingQuiz() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({
    livingWith: null,
    tenure: null,
    budget: null,
    commuteMethod: null,
    hasCar: null,
    priorities: Object.fromEntries(PRIORITY_ITEMS.map(p => [p.key, 3])),
  });
  const [results, setResults] = useState(null);
  const [expandedIdx, setExpandedIdx] = useState(null);
  const [activeTab, setActiveTab] = useState("all");
  const topRef = useRef(null);

  useEffect(() => {
    if (topRef.current) topRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [step, results]);

  const update = (key, val) => setAnswers(prev => ({ ...prev, [key]: val }));

  const canProceed = () => {
    if (step === 0) return answers.livingWith != null;
    if (step === 1) return answers.tenure != null;
    if (step === 2) return answers.budget != null;
    if (step === 3) return answers.commuteMethod != null;
    if (step === 4) return answers.hasCar != null;
    return true;
  };

  const computeResults = () => {
    const townResults = Object.entries(TOWNS).map(([name, data]) => ({
      name, type: "town", data, score: scoreLocation(data, answers),
    })).sort((a, b) => b.score - a.score).slice(0, 5);

    const hoodResults = Object.entries(NEIGHBORHOODS).map(([name, data]) => ({
      name, type: "neighborhood", data, score: scoreLocation(data, answers),
    })).sort((a, b) => b.score - a.score).slice(0, 5);

    const aptResults = Object.entries(APARTMENTS).map(([name, data]) => ({
      name, type: "apartment", data, score: scoreLocation(data, answers),
    })).sort((a, b) => b.score - a.score).slice(0, 5);

    setResults({ towns: townResults, neighborhoods: hoodResults, apartments: aptResults });
  };

  const filteredResults = () => {
    if (!results) return [];
    if (activeTab === "towns") return results.towns;
    if (activeTab === "neighborhoods") return results.neighborhoods;
    if (activeTab === "apartments") return results.apartments;
    // All combined
    const all = [...results.towns, ...results.neighborhoods, ...results.apartments];
    return all.sort((a, b) => b.score - a.score).slice(0, 15);
  };

  const TOTAL_STEPS = 6;

  // ─── RENDER ───
  return (
    <div ref={topRef} style={{
      fontFamily: "'Source Serif 4', Georgia, serif",
      maxWidth: 640, margin: "0 auto", minHeight: "100vh",
      background: "#fff", color: "#1a2332",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Source+Serif+4:opsz,wght@8..60,300;8..60,400;8..60,600;8..60,700&display=swap" rel="stylesheet" />

      {/* Header */}
      <div style={{ background: YALE_BLUE, padding: "28px 28px 24px", color: "#fff" }}>
        <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 2, opacity: 0.7, marginBottom: 6 }}>
          Yale New Haven Hospital · GME Housing
        </div>
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, lineHeight: 1.2 }}>
          Find Your Ideal Housing
        </h1>
        <p style={{ margin: "8px 0 0", fontSize: 14, opacity: 0.8, fontWeight: 300 }}>
          Based on survey data from {Object.values(TOWNS).reduce((a,t) => a+t.n, 0)}+ current residents and fellows
        </p>
      </div>

      <div style={{ padding: "24px 28px 40px" }}>
        {!results ? (
          <>
            <ProgressBar current={step} total={TOTAL_STEPS} />

            {/* Step 0: Living Situation */}
            {step === 0 && (
              <div>
                <h2 style={{ fontSize: 20, margin: "0 0 6px", fontWeight: 700 }}>Living Situation</h2>
                <p style={{ color: "#7a8696", fontSize: 14, margin: "0 0 20px" }}>Who will you be living with?</p>
                <div style={{ display: "grid", gap: 10 }}>
                  {[
                    { val: "alone", label: "Living alone", icon: "👤" },
                    { val: "partner", label: "With a partner", icon: "👫" },
                    { val: "partner_kids", label: "With partner & children", icon: "👨‍👩‍👧" },
                    { val: "roommate", label: "With a roommate", icon: "🏠" },
                  ].map(opt => (
                    <OptionCard key={opt.val} selected={answers.livingWith === opt.val}
                      onClick={() => update("livingWith", opt.val)}>
                      <span style={{ marginRight: 10 }}>{opt.icon}</span>{opt.label}
                    </OptionCard>
                  ))}
                </div>
              </div>
            )}

            {/* Step 1: Rent or Own */}
            {step === 1 && (
              <div>
                <h2 style={{ fontSize: 20, margin: "0 0 6px", fontWeight: 700 }}>Rent or Own?</h2>
                <p style={{ color: "#7a8696", fontSize: 14, margin: "0 0 20px" }}>What is your preference?</p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  <OptionCard selected={answers.tenure === "rent"} onClick={() => update("tenure", "rent")}>
                    <div style={{ fontSize: 28, marginBottom: 6 }}>🔑</div>
                    <div style={{ fontWeight: 600 }}>Rent</div>
                  </OptionCard>
                  <OptionCard selected={answers.tenure === "own"} onClick={() => update("tenure", "own")}>
                    <div style={{ fontSize: 28, marginBottom: 6 }}>🏡</div>
                    <div style={{ fontWeight: 600 }}>Own</div>
                  </OptionCard>
                </div>
              </div>
            )}

            {/* Step 2: Budget */}
            {step === 2 && (
              <div>
                <h2 style={{ fontSize: 20, margin: "0 0 6px", fontWeight: 700 }}>Monthly Housing Budget</h2>
                <p style={{ color: "#7a8696", fontSize: 14, margin: "0 0 20px" }}>
                  Select your target monthly cost (rent/mortgage). We'll also recommend options below this range.
                </p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  {BUDGET_OPTIONS.map(opt => (
                    <OptionCard key={opt.value} selected={answers.budget === opt.value}
                      onClick={() => update("budget", opt.value)}>
                      {opt.label}
                    </OptionCard>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3: Commute Method */}
            {step === 3 && (
              <div>
                <h2 style={{ fontSize: 20, margin: "0 0 6px", fontWeight: 700 }}>Preferred Commute Method</h2>
                <p style={{ color: "#7a8696", fontSize: 14, margin: "0 0 20px" }}>How do you plan to get to work?</p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  {[
                    { val: "walk", label: "Walk", icon: "🚶" },
                    { val: "bike", label: "Bike", icon: "🚲" },
                    { val: "drive", label: "Drive", icon: "🚗" },
                    { val: "transit", label: "Public Transit", icon: "🚌" },
                  ].map(opt => (
                    <OptionCard key={opt.val} selected={answers.commuteMethod === opt.val}
                      onClick={() => update("commuteMethod", opt.val)}>
                      <div style={{ fontSize: 24, marginBottom: 4 }}>{opt.icon}</div>
                      <div style={{ fontWeight: 600, fontSize: 14 }}>{opt.label}</div>
                    </OptionCard>
                  ))}
                </div>
              </div>
            )}

            {/* Step 4: Car */}
            {step === 4 && (
              <div>
                <h2 style={{ fontSize: 20, margin: "0 0 6px", fontWeight: 700 }}>Will You Have a Car?</h2>
                <p style={{ color: "#7a8696", fontSize: 14, margin: "0 0 20px" }}>This helps us filter locations where a car is essential.</p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  <OptionCard selected={answers.hasCar === true} onClick={() => update("hasCar", true)}>
                    <div style={{ fontSize: 28, marginBottom: 6 }}>✅</div>
                    <div style={{ fontWeight: 600 }}>Yes</div>
                  </OptionCard>
                  <OptionCard selected={answers.hasCar === false} onClick={() => update("hasCar", false)}>
                    <div style={{ fontSize: 28, marginBottom: 6 }}>🚫</div>
                    <div style={{ fontWeight: 600 }}>No</div>
                  </OptionCard>
                </div>
              </div>
            )}

            {/* Step 5: Priorities */}
            {step === 5 && (
              <div>
                <h2 style={{ fontSize: 20, margin: "0 0 6px", fontWeight: 700 }}>What Matters to You?</h2>
                <p style={{ color: "#7a8696", fontSize: 14, margin: "0 0 20px" }}>
                  Rate each factor from 1 (not important) to 5 (very important).
                </p>
                <div style={{ background: "#f8f9fb", borderRadius: 12, padding: "20px 20px 8px" }}>
                  {PRIORITY_ITEMS.map(item => (
                    <PrioritySlider key={item.key} label={item.label}
                      value={answers.priorities[item.key]}
                      onChange={val => setAnswers(prev => ({
                        ...prev,
                        priorities: { ...prev.priorities, [item.key]: val }
                      }))} />
                  ))}
                </div>
              </div>
            )}

            {/* Navigation */}
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 28 }}>
              {step > 0 ? (
                <button onClick={() => setStep(s => s - 1)} style={{
                  border: `1px solid ${YALE_BLUE}`, background: "#fff", color: YALE_BLUE,
                  borderRadius: 8, padding: "10px 24px", cursor: "pointer",
                  fontFamily: "'Source Serif 4', Georgia, serif", fontSize: 14, fontWeight: 600,
                }}>← Back</button>
              ) : <div />}

              {step < TOTAL_STEPS - 1 ? (
                <button onClick={() => canProceed() && setStep(s => s + 1)}
                  disabled={!canProceed()}
                  style={{
                    border: "none", background: canProceed() ? YALE_BLUE : "#c5cdd8",
                    color: "#fff", borderRadius: 8, padding: "10px 28px", cursor: canProceed() ? "pointer" : "not-allowed",
                    fontFamily: "'Source Serif 4', Georgia, serif", fontSize: 14, fontWeight: 600,
                    transition: "background 0.2s",
                  }}>Next →</button>
              ) : (
                <button onClick={computeResults} style={{
                  border: "none", background: YALE_BLUE, color: "#fff",
                  borderRadius: 8, padding: "12px 32px", cursor: "pointer",
                  fontFamily: "'Source Serif 4', Georgia, serif", fontSize: 15, fontWeight: 700,
                  boxShadow: "0 2px 8px rgba(0,53,107,0.25)",
                }}>See My Results ✨</button>
              )}
            </div>
          </>
        ) : (
          /* ─── RESULTS ─── */
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
              <h2 style={{ fontSize: 22, margin: 0, fontWeight: 700 }}>Your Matches</h2>
              <button onClick={() => { setResults(null); setStep(0); setExpandedIdx(null); setActiveTab("all"); }}
                style={{
                  border: `1px solid ${YALE_BLUE}`, background: "transparent", color: YALE_BLUE,
                  borderRadius: 6, padding: "6px 14px", cursor: "pointer",
                  fontSize: 12, fontWeight: 600, fontFamily: "'Source Serif 4', Georgia, serif",
                }}>Retake Quiz</button>
            </div>

            {/* Tabs */}
            <div style={{ display: "flex", gap: 0, marginBottom: 20, borderBottom: "2px solid #eef1f5" }}>
              {[
                { key: "all", label: "All Results" },
                { key: "towns", label: "Towns" },
                { key: "neighborhoods", label: "Neighborhoods" },
                { key: "apartments", label: "Apartments" },
              ].map(tab => (
                <button key={tab.key} onClick={() => { setActiveTab(tab.key); setExpandedIdx(null); }}
                  style={{
                    border: "none", background: "transparent",
                    borderBottom: activeTab === tab.key ? `2px solid ${YALE_BLUE}` : "2px solid transparent",
                    marginBottom: -2, padding: "8px 14px", cursor: "pointer",
                    fontFamily: "'Source Serif 4', Georgia, serif", fontSize: 13,
                    fontWeight: activeTab === tab.key ? 700 : 400,
                    color: activeTab === tab.key ? YALE_BLUE : "#7a8696",
                  }}>{tab.label}</button>
              ))}
            </div>

            {/* Result Cards */}
            {filteredResults().map((r, i) => (
              <ResultCard key={`${r.type}-${r.name}`} rank={i + 1} name={r.name}
                type={r.type} matchPct={r.score} data={r.data}
                isExpanded={expandedIdx === `${r.type}-${r.name}`}
                onToggle={() => setExpandedIdx(prev =>
                  prev === `${r.type}-${r.name}` ? null : `${r.type}-${r.name}`
                )} />
            ))}

            <div style={{
              marginTop: 24, padding: 16, background: "#f8f9fb",
              borderRadius: 10, fontSize: 12, color: "#7a8696", lineHeight: 1.6,
            }}>
              <strong style={{ color: "#4a5568" }}>About this data:</strong> Results are based on survey responses
              from {Object.values(TOWNS).reduce((a,t) => a+t.n, 0)}+ current YNHH residents and fellows. Match
              percentages reflect how well each location aligns with your stated preferences. Tap any result to see
              detailed survey data. Rent figures and ratings reflect respondent-reported values and may not represent
              current market conditions.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
