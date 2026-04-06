export const STICKY_COLORS = [
  // New Pastel Palette from Image
  { id: 'p1', bg: '#f9f4d1', text: '#5c542b', border: '#e6dfbc', title: '#4a4422' },
  { id: 'p2', bg: '#f4f6ce', text: '#545729', border: '#dfe1ba', title: '#42451f' },
  { id: 'p3', bg: '#eef2d0', text: '#4f532a', border: '#d9ddba', title: '#3d401e' },
  { id: 'p4', bg: '#f2edd1', text: '#55512b', border: '#ddd8bc', title: '#43401f' },
  { id: 'p5', bg: '#f1e6cc', text: '#554a32', border: '#dbd0b9', title: '#433c27' },
  { id: 'p6', bg: '#edd9bb', text: '#524531', border: '#d8c5aa', title: '#403626' },
  
  { id: 'p7', bg: '#ecd7af', text: '#51442d', border: '#d7c4a0', title: '#3f3522' },
  { id: 'p8', bg: '#eccfac', text: '#51442d', border: '#d7bc9e', title: '#3f3521' },
  { id: 'p9', bg: '#e8c2a4', text: '#513d2f', border: '#d3b196', title: '#3f2e22' },
  { id: 'p10', bg: '#e4b6a1', text: '#50382d', border: '#d0a693', title: '#3f2b21' },
  { id: 'p11', bg: '#dfa69d', text: '#502f2b', border: '#cc978f', title: '#3d231f' },
  { id: 'p12', bg: '#db969a', text: '#502b2d', border: '#c7898d', title: '#3d1f21' },

  { id: 'p13', bg: '#d68e96', text: '#502a2d', border: '#c38289', title: '#3d1e21' },
  { id: 'p14', bg: '#d89da4', text: '#503337', border: '#c58f96', title: '#3d2529' },
  { id: 'p15', bg: '#dba9b0', text: '#513d42', border: '#c799a1', title: '#3d2d31' },
  { id: 'p16', bg: '#dfb7ba', text: '#514547', border: '#ccabba', title: '#3d3436' },
  { id: 'p17', bg: '#e4c4c8', text: '#514d4f', border: '#d0b3b7', title: '#3d3a3c' },
  { id: 'p18', bg: '#e9ced5', text: '#515357', border: '#d2bbbf', title: '#3e4143' },

  { id: 'p19', bg: '#d4acc4', text: '#4e3a47', border: '#c19cb3', title: '#3c2c36' },
  { id: 'p20', bg: '#ccaacc', text: '#4a3b4a', border: '#b999b9', title: '#382d38' },
  { id: 'p21', bg: '#c4aace', text: '#443b4d', border: '#b199bb', title: '#322d3a' },
  { id: 'p22', bg: '#b9aace', text: '#3c3b4d', border: '#a899bb', title: '#2d2d3a' },
  { id: 'p23', bg: '#acaace', text: '#343b4d', border: '#9b99bb', title: '#262d3a' },
  { id: 'p24', bg: '#a3aace', text: '#2e3b4d', border: '#9499bb', title: '#222d3a' },

  { id: 'p25', bg: '#9baacc', text: '#2d3b4b', border: '#8da2c8', title: '#212d38' },
  { id: 'p26', bg: '#9bb2d2', text: '#2d3e52', border: '#8da2be', title: '#212f3e' },
  { id: 'p27', bg: '#9bc2d8', text: '#2d4756', border: '#8dafc4', title: '#213642' },
  { id: 'p28', bg: '#9bcbdc', text: '#2d4d59', border: '#8db7c7', title: '#213d45' },
  { id: 'p29', bg: '#9cd1df', text: '#2d515a', border: '#8dbcc9', title: '#214146' },
  { id: 'p30', bg: '#addbe2', text: '#36585d', border: '#9dc7ce', title: '#294448' },

  { id: 'p31', bg: '#bce4e5', text: '#3f5d5e', border: '#aacfd0', title: '#314849' },
  { id: 'p32', bg: '#cde9e8', text: '#4c6463', border: '#bad2d1', title: '#3c4d4c' },
  { id: 'p33', bg: '#d7efef', text: '#526b6b', border: '#c3d8d8', title: '#3f5353' },
  { id: 'p34', bg: '#e1f4f4', text: '#577171', border: '#ccdddd', title: '#435858' },
  { id: 'p35', bg: '#ecf9f9', text: '#5c7878', border: '#d5e2e2', title: '#475e5e' },
];

/**
 * Returns a random sticky color scheme from the predefined list.
 */
export const getRandomStickyColor = () => {
  return STICKY_COLORS[Math.floor(Math.random() * STICKY_COLORS.length)];
};

/**
 * Returns a color scheme by its ID.
 */
export const getStickyColorById = (id) => {
  return STICKY_COLORS.find(c => c.id === id) || STICKY_COLORS[0];
};
