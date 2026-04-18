// Tasmania regions — simplified polygon shapes roughly corresponding to real Tas regions.
// Not geographically precise; stylized for the quote map picker.

const TAS_REGIONS = [
  { id: 'north-west', name: 'North West', city: 'Burnie · Devonport',
    path: 'M90,90 L180,85 L220,110 L215,155 L140,165 L95,145 Z' },
  { id: 'launceston', name: 'Launceston & North', city: 'Launceston',
    path: 'M220,110 L310,100 L330,150 L260,175 L215,155 Z' },
  { id: 'east-coast', name: 'East Coast', city: 'St Helens · Bicheno',
    path: 'M330,150 L360,170 L370,250 L340,290 L310,280 L300,220 Z' },
  { id: 'midlands', name: 'Midlands', city: 'Oatlands · Campbell Town',
    path: 'M215,155 L260,175 L300,220 L290,260 L230,255 L205,220 Z' },
  { id: 'hobart', name: 'Hobart & South', city: 'Hobart · Kingston',
    path: 'M230,255 L290,260 L310,280 L305,320 L270,340 L225,320 L215,285 Z' },
  { id: 'west-coast', name: 'West Coast', city: 'Strahan · Queenstown',
    path: 'M95,145 L140,165 L205,220 L230,255 L215,285 L170,290 L110,240 L85,180 Z' },
];

window.TAS_REGIONS = TAS_REGIONS;
