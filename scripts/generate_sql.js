const fs = require('fs');

const content = fs.readFileSync('All plumbers - ai_studio_code - ai_studio_code.csv.csv.csv', 'utf8');
const lines = content.split('\n');

let sql = '';

for(let i=1; i<lines.length; i++) {
  const line = lines[i];
  if(!line.trim()) continue;
  
  // Parse CSV correctly handling quotes
  const regex = /(?:\"([^\"]*)\"|([^,]*))(?:,|$)/g;
  let match;
  let cols = [];
  while ((match = regex.exec(line)) !== null) {
      if (match.index === regex.lastIndex) regex.lastIndex++;
      cols.push(match[1] !== undefined ? match[1] : match[2]);
  }
  
  const name = cols[0]?.replace(/'/g, "''"); // escape single quotes for SQL
  const bbbUrl = cols[1]?.trim();
  const effNs = cols[9]?.trim();
  
  if(bbbUrl || effNs) {
    let updateFields = [];
    if(bbbUrl) {
      updateFields.push(`is_bbb_accredited = TRUE`);
      updateFields.push(`bbb_url = '${bbbUrl.replace(/'/g, "''")}'`);
      updateFields.push(`is_verified = TRUE`);
    }
    if(effNs) {
      updateFields.push(`is_efficiency_ns_partner = TRUE`);
    }
    
    if(updateFields.length > 0) {
      sql += `UPDATE businesses SET ${updateFields.join(', ')} WHERE name = '${name}';\n`;
    }
  }
}

fs.writeFileSync('update.sql', sql);
console.log('SQL generated.');
