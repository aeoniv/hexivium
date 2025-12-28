export interface PalaceData {
    star: number;
    element: string;
    trigramName: string;
    trigramSymbol: string;
    direction: string;
    bodyPart: string;
    person: string;
    positiveNature: string;
    negativeNature: string;
}

export const ninePalacesData: PalaceData[] = [
    {
      star: 1,
      element: 'Water',
      trigramName: '坎',
      trigramSymbol: '☵',
      direction: 'North',
      bodyPart: 'Kidneys, bladder, reproductive system, lymphatic system, ears',
      person: 'Middle-aged men (30s), middle son',
      positiveNature: 'Fame, fortune, wisdom, scholarship, good health',
      negativeNature: 'Health: Sexual diseases, diabetes, ear disorders. Activities: Separation, divorce, drowning, piracy, criminal activities, prostitution, sex industry'
    },
    {
      star: 2,
      element: 'Earth',
      trigramName: '坤',
      trigramSymbol: '☷',
      direction: 'Southwest',
      bodyPart: 'Stomach, spleen, pancreas (digestive system)',
      person: 'Mother, grandmother, older women',
      positiveNature: 'Fertility, robust health, real estate prosperity',
      negativeNature: 'Health: Abdominal disorders, miscarriage. Activities: Disastrous accidents'
    },
    {
      star: 3,
      element: 'Wood',
      trigramName: '震',
      trigramSymbol: '☳',
      direction: 'East',
      bodyPart: 'Liver, gallbladder, feet, arms',
      person: 'Eldest son, mature men, husband',
      positiveNature: 'Fame, ambition, high status',
      negativeNature: 'Health: Foot disorders, liver cancer, arm injuries. Activities: Lawsuits, theft, asthma'
    },
    {
      star: 4,
      element: 'Wood',
      trigramName: '巽',
      trigramSymbol: '☴',
      direction: 'Southeast',
      bodyPart: 'Liver, gallbladder, thighs, breast, chest',
      person: 'Eldest daughter, mature women, wife',
      positiveNature: 'Wisdom, romance, literacy, reputation',
      negativeNature: 'Health: Breast cancer, asthma, thigh injuries. Activities: Adultery, family breakdown, insanity, suicide (hanging/drugs), unethical behavior, infidelity'
    },
    {
      star: 5,
      element: 'Earth',
      trigramName: 'None',
      trigramSymbol: '',
      direction: 'Center',
      bodyPart: 'None specified',
      person: 'None specified',
      positiveNature: 'Great success, immense wealth, authority, imperial power',
      negativeNature: 'Health: Plague, chronic illnesses. Activities: Lawsuits, disloyalty, catastrophe, death'
    },
    {
      star: 6,
      element: 'Metal',
      trigramName: '乾',
      trigramSymbol: '☰',
      direction: 'Northwest',
      bodyPart: 'Lungs, large intestine, bones',
      person: 'Father, grandfather, elderly men',
      positiveNature: 'Authority, dignity, determination, leadership',
      negativeNature: 'Health: Skull injuries, brain cancer, headaches, lung disease, intestinal cancer, fractures. Activities: Loneliness, rigidity, car accidents, authority conflicts'
    },
    {
      star: 7,
      element: 'Metal',
      trigramName: '兌',
      trigramSymbol: '☱',
      direction: 'West',
      bodyPart: 'Upper jaw, teeth, mouth, upper respiratory system',
      person: 'Youngest daughter, young girls, young women',
      positiveNature: 'Happiness, wealth',
      negativeNature: 'Health: Mouth disorders, toothaches, jaw injuries. Activities: Theft, robbery, gossip, villainy, excessive flirting'
    },
    {
      star: 8,
      element: 'Earth',
      trigramName: '艮',
      trigramSymbol: '☶',
      direction: 'Northeast',
      bodyPart: 'Fingers, toes, nose, back',
      person: 'Youngest son, young boys, young men',
      positiveNature: 'Extreme wealth, nobility, steadfastness',
      negativeNature: 'Health: Finger/toe injuries, nosebleeds, back pain, nose cancer. Activities: Harm to children, disloyalty, riots, sudden wealth loss'
    },
    {
      star: 9,
      element: 'Fire',
      trigramName: '離',
      trigramSymbol: '☲',
      direction: 'South',
      bodyPart: 'Heart, blood, small intestine, tongue, eyes',
      person: 'Middle-aged women (30s), middle daughter',
      positiveNature: 'Immense success, promotion, marriage, celebrations',
      negativeNature: 'Health: Eye disorders, blood cancer, mental impairment, blindness, tongue issues, heart attack. Activities: Fires, inappropriate sexual affairs, reckless behavior'
    }
  ];
