const fs = require('fs');
// const fetch = require('node-fetch')
function camelize(str) {
    return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function(word, index) {
      return index === 0 ? word.toLowerCase() : word.toUpperCase();
    }).replace(/\s+/g, '').replace(/[\])}[{(]/g, '').replace(/\:/g, '');
  }

const getIfs = (control) => {
    let fors = []
    if(control.for){
        medicines = ['Zejula','Ojjaara','Jemperli']
        medicines.forEach(elem => {
            if(control.for.includes(elem))
            {
                fors.push(`\'${elem}\'`)
            }
        });
        return fors.join(', ');
    }
    return '\'Zejula\',\'Ojjaara\',\'Jemperli\'';

}
const getValds = (control) => {
    let valds = [];
    for(let key in control.validators){
        if(control.validators[key]){
            valds.push(`, Validators.${key}`);
        }
    }
    return valds.join(',')
}

const getOptsTs = (control) => {
    let ts = '';
    // let ts = '[';
    let tsArr = [];
    for(let option of control.options){
        // ts += 'new FormControl(false)'
        // ts += 'false'
        tsArr.push('false'); 
    }
    ts += tsArr.join(',');
    // ts += ']';
    return ts;
}

function generateReactiveForm(json) {
    let html = '';
    let ts = '';
    html += '<div>\n'
    for(key in json){
        html += `<form [formGroup]="${key}Form">\n`;
        ts += `${key}Form = this.fb.group({\n`;
        // console.log('key here =',key);
      for (let control of json[key].controls) {
        // console.log('key here =',key);

        let label = control.label;
        let placeholder = control.placeholder;
        // let validators = JSON.stringify(control.validators);
        let disabled = control.disabled ? 'disabled' : '';
        let ifs = getIfs(control);
        let valds = getValds(control);
        
        if (control.type === 'text') {
          html += `  <div *ngIf="[${ifs}].includes(medicine)" class="form-group">\n    <label>${label}</label>\n    <input type="text" formControlName="${camelize(control.name)}" class="form-control" placeholder="${placeholder}" ${disabled}>\n  </div>\n`;
          ts += `    ${camelize(control.name)}: ['${control.value}'${valds}],\n`;
        } else if (control.type === 'date') {
          html += `  <div *ngIf="[${ifs}].includes(medicine)" class="form-group">\n    <label>${label}</label>\n    <input type="date" formControlName="${camelize(control.name)}" class="form-control" placeholder="${placeholder}" ${disabled}>\n  </div>\n`;
          ts += `    ${camelize(control.name)}: ['${control.value}'${valds}],\n`;
        } else if (control.type === 'radio') {
          html += `  <div *ngIf="[${ifs}].includes(medicine)" class="form-group">\n    <label>${label}</label>\n`;
          for (let option of control.options) {
            let opifs = getIfs(option)
            html += `    <div *ngIf="[${opifs}].includes(medicine)" class="form-check">\n      <input type="radio" formControlName="${camelize(control.name)}" class="form-check-input" value="${option.value}" ${disabled}>\n      <label class="form-check-label">${option.label}</label>\n    </div>\n`;
          }
          html += `  </div>\n`;
          ts += `    ${camelize(control.name)}: ['${control.value}'${valds}],\n`;
        } else if (control.type === 'checkbox') {
        //   html += `  <div *ngIf="[${ifs}].includes(medicine)" formArrayName="${camelize(control.name)}" class="form-group">\n    <label>${label}</label>\n`;
        //   let idx = 0;
        //   for (let option of control.options) {
        //     html += `    <div class="form-check">\n      <input type="checkbox" [formControlName]="${idx}" class="form-check-input" value="${option.value}" ${disabled}>\n      <label class="form-check-label">${option.label}</label>\n    </div>\n`;
        //     idx++;
        //     }
        //   html += `  </div>\n`;
        //   ts += `    ${camelize(control.name)}: this.fb.array([${getOptsTs(control)}]),\n`;
        //   console.log('key =',key )

            html += `  <div *ngIf="[${ifs}].includes(medicine)" class="form-group">\n    <label>${label}</label>\n`;

          for (let option of control.options) {
            html += `    <div class="form-check">\n      <input type="checkbox" (change)="onCheckChange({ev:$event,form:${key}Form,formArrName:'${camelize(control.name)}'})" class="form-check-input" value="${option.value}" ${disabled}>\n      <label class="form-check-label">${option.label}</label>\n    </div>\n`;
          }
          html += `  </div>\n`;
          ts += `    ${camelize(control.name)}: this.fb.array([]),\n`;


        } 
        else if(control.type === 'textarea'){
            // html += `<label></label><textarea> </textarea>`
            html += `  <div *ngIf="[${ifs}].includes(medicine)" class="form-group">\n    <label>${label}</label>\n    <textarea formControlName="${camelize(control.name)}" class="form-control">\n      </textarea>\n </div>\n`;
            ts += `    ${camelize(control.name)}: ['${control.value}'${valds}],\n`;
        }
        // else if(control.type === 'select'){
        //     html += `  <div class="form-group">\n    <label>${label}</label>\n <select>`
        //     ts += 
        // }
        else {
            // console.log('idk', control.type);
        }
      }
      html += '</form>\n';
      ts += '  });\n';
      

    } 

    html += '</div>'
  
  
  return {html, ts};
}

// Example usage
// const json = {...}; // replace with actual JSON object
// const json = await fetch('./b.json');
const json = {
    "clinicalInfo": {
      "controls": [
        {
          "name": "patientFirstName",
          "value": "",
          "display": true,
          "label": "Patient First Name",
          "placeholder": "Enter your First name",
          "type": "text",
          "validators": {},
          "for": "Zejula, Ojjaara, Jemperli"
        },
        {
          "name": "patientLastName ",
          "value": "",
          "display": true,
          "label": "Patient Last Name",
          "placeholder": "Enter your Last Name ",
          "type": "text",
          "validators": {},
          "for": "Zejula, Ojjaara, Jemperli"
        },
        {
          "name": "patientDateOfBirth",
          "value": "",
          "display": true,
          "label": "Date of Birth",
          "placeholder": "mm/dd/yyyy",
          "type": "date",
          "validators": { "required": true },
          "disabled": false,
          "for": "Zejula, Ojjaara, Jemperli"
        },
        {
          "name": "treatmentStartDate",
          "value": "",
          "display": true,
          "label": "Treatment Start Date",
          "placeholder": "mm/dd/yyyy",
          "type": "date",
          "validators": {},
          "disabled": false,
          "for": "Zejula, Ojjaara"
        },
        {
          "name": "primaryDiagnosis",
          "value": "",
          "display": true,
          "label": "Primary Diagnosis",
          "placeholder": "Enter your Primary Diagnosis",
          "type": "text",
          "validators": { "required": true },
          "for": "Zejula, Ojjaara"
        },
        {
          "name": "primaryDiagnosisICD10Code",
          "value": "",
          "display": true,
          "label": "Primary Diagnosis ICD-10 Code",
          "placeholder": "Enter your Primary Diagnosis ICD-10 Code",
          "type": "text",
          "validators": { "required": true },
          "for": "Zejula, Ojjaara"
        },
        {
          "name": "diagnosisICD10Code",
          "value": "",
          "display": true,
          "label": "Diagnosis ICD-10 Code",
          "placeholder": "",
          "type": "radio",
          "validators": { "required": true },
          "options": [
            {
              "label": "C54.1-Malignant neoplasm of endometriume",
              "value": "C54.1-Malignant neoplasm of endometrium"
            },
            {
              "label": "Other",
              "value": "Other"
            }
          ],
          "for": "Jemperli"
        },
        {
          "name": "otherICD10Code",
          "value": "",
          "display": false,
          "label": "Other ICD Code",
          "placeholder": "",
          "type": "text",
          "validators": { "required": true },
          "for": "Jemperli"
        },
        {
          "name": "mismatchrepairstatusMMR",
          "value": "",
          "display": true,
          "label": "Mismatch repair status (MMR)",
          "placeholder": "",
          "type": "checkbox",
          "validators": { "required": true },
          "options": [
            {
              "label": "Mismatch repair deficient (dMMR)",
              "value": "Mismatch repair deficient (dMMR)"
            },
            {
              "label": "Mismatch repair proficient (MMRp)",
              "value": "Mismatch repair proficient (MMRp)"
            }
          ],
          "for": "Jemperli"
        },
        {
          "name": "endometrialCancerPriortherapies ",
          "value": "",
          "display": true,
          "label": "Endometrial cancer prior therapies ",
          "placeholder": "",
          "type": "checkbox",
          "validators": { "required": true },
          "options": [
            {
              "label": "Treatment with platinum containing regimen",
              "value": "Treatment with platinum containing regimen"
            },
            {
              "label": "Other",
              "value": "Other"
            }
          ],
          "for": "Jemperli"
        },
        {
          "name": "secondaryDiagnosis",
          "value": "",
          "display": true,
          "label": "Secondary Diagnosis",
          "placeholder": "Enter your Secondary Diagnosis",
          "type": "text",
          "validators": {},
          "for": "Zejula, Ojjaara"
        },
        {
          "name": "secondaryDiagnosisICD10Code",
          "value": "",
          "display": true,
          "label": "Secondary Diagnosis ICD-10 Code",
          "placeholder": "Enter your Secondary Diagnosis ICD-10 Code",
          "type": "text",
          "validators": {},
          "for": "Zejula, Ojjaara"
        }
      ]
    },
    "currentLineOfTherapy": {
      "controls": [
        {
          "name": "currentLineOfTherapy",
          "value": "",
          "display": true,
          "label": "",
          "placeholder": "",
          "type": "radio",
          "validators": { "required": true },
          "options": [
            {
              "label": "1st line",
              "value": "1st line"
            },
            {
              "label": "2nd line",
              "value": "2nd line"
            },
            {
              "label": "3rd line",
              "value": "3rd line"
            },
            {
              "label": "4th line",
              "value": "4th line"
            },
            {
              "label": "4th line+",
              "value": "4th line+"
            }
          ],
          "class": "blockRadio",
          "for": "Zejula"
        },
        {
          "name": "BRCA Test",
          "value": "",
          "display": true,
          "label": "BRCA Test",
          "placeholder": "",
          "type": "radio",
          "validators": {},
          "options": [
            {
              "label": "Positive",
              "value": "Positive"
            },
            {
              "label": "Negative",
              "value": "Negative"
            },
            {
              "label": "Results Pending",
              "value": "Results Pending"
            },
            {
              "label": "No Test",
              "value": "No Test"
            }
          ],
          "class": "blockRadio",
          "for": "Zejula"
        },
        {
          "name": "HRD Test",
          "value": "",
          "display": true,
          "label": "HRD Test",
          "placeholder": "",
          "type": "radio",
          "validators": {},
          "options": [
            {
              "label": "Positive",
              "value": "Positive"
            },
            {
              "label": "Negative",
              "value": "Negative"
            },
            {
              "label": "Results Pending",
              "value": "Results Pending"
            },
            {
              "label": "No Test",
              "value": "No Test"
            }
          ],
          "class": "blockRadio",
          "for": "Zejula"
        },
        {
          "name": "previousTherapies",
          "value": "",
          "display": true,
          "label": "Previous Therapies",
          "placeholder": "Enter your Previous Therapies ",
          "type": "text",
          "validators": {},
          "for": "Ojjaara"
        },
        {
          "name": "latestHemoglobin",
          "value": "",
          "display": true,
          "label": "Latest Hemoglobin (g/dL)",
          "placeholder": "Enter your Latest Hemoglobin ",
          "type": "text",
          "validators": {},
          "for": "Ojjaara"
        },
        {
          "name": "dateOfLastTransfusion",
          "value": "",
          "display": true,
          "label": "Date of Last Transfusion",
          "placeholder": "",
          "type": "date",
          "validators": {},
          "for": "Ojjaara"
        },
        {
          "name": "knownDrugAllergies",
          "value": "",
          "display": true,
          "label": "Known Drug Allergies",
          "placeholder": "Enter your Known Drug Allergies",
          "type": "text",
          "validators": {},
          "for": "Zejula , Ojjaara "
        },
        {
          "name": "notes",
          "value": "",
          "display": true,
          "label": "Notes",
          "placeholder": "Enter your Notes",
          "type": "textarea",
          "validators": {},
          "for": "Zejula , Ojjaara "
        }
      ]
    },
    "prescriptionInfo": {
      "controls": [
        {
          "name": "zejStd",
          "value": "",
          "display": true,
          "label": "",
          "placeholder": "",
          "type": "checkbox",
          "validators": {},
          "for": "Zejula",
          "options": [
            {
              "label": "ZEJULA: Standard Prescription",
              "value": {
                "Id": 1,
                "Name": "standard"
              },
              "for": "Zejula",
              "value":"zejStd"

            }
          ]
        },
        {
          "name": "zejStdPres",
          "label": "",
          "display": false,
          "value": "",
          "type": "prescription",
          "placeholder": "",
          "qty": 15,
          "refills": 14,
          "for": "Zejula"
        },
        {
          "name": "zejQSP",
          "value": "",
          "display": true,
          "label": "",
          "placeholder": "",
          "type": "checkbox",
          "validators": {},
          "for": "Zejula",
          "options": [
            {
              "label": "ZEJULA: Quick Start Program",
              "subLabel": "For patients experiencing a delay in coverage at first dispense",
              "value": {
                "Id": 1,
                "Name": "quickStartProgram"
              },
              "for": "Zejula",
              "value":"zejQSP"

            }
          ]
        },
        {
          "name": "zejQSPPres",
          "label": "",
          "display": false,
          "value": "",
          "type": "prescription",
          "placeholder": "",
          "for": "Zejula"
        },
        {
          "name": "zejBridge",
          "value": "",
          "display": true,
          "label": "",
          "placeholder": "",
          "type": "checkbox",
          "validators": {},
          "for": "Zejula",
          "options": [
            {
              "label": "ZEJULA: Bridge Program",
              "subLabel": "For patients experiencing coverage interruptions while already on treatment",
              "value": {
                "Id": 1,
                "Name": ""
              },
              "for": "Zejula",
              "value":"zejBridge"

            }
          ]
        },
        {
          "name": "zejBridgePres",
          "label": "",
          "display": false,
          "value": "",
          "type": "prescription",
          "placeholder": "",
          "qty": 15,
          "refills": 14,
          "for": "Zejula"
        },
        {
          "name": "ojjaaraStd",
          "value": "",
          "display": true,
          "label": "",
          "placeholder": "",
          "type": "checkbox",
          "validators": {},
          "for": "Ojjaara",
          "options": [
            {
              "label": "OJJAARA: Standard Prescription",
              "value": {
                "Id": 1,
                "Name": "standard"
              },
              "for": "Ojjaara",
              "value":"ojjaaraStd",
            }
          ]
        },
        {
          "name": "ojjaaraStdPres",
          "label": "",
          "display": false,
          "value": "",
          "type": "prescription",
          "placeholder": "",
          "for": "Ojjaara"
        },
        {
          "name": "ojjaaraQSP",
          "value": "",
          "display": true,
          "label": "",
          "placeholder": "",
          "type": "checkbox",
          "validators": {},
          "for": "Ojjaara",
          "options": [
            {
              "label": "OJJAARA: Quick Start Program",
              "subLabel": "For patients experiencing a delay in coverage at first dispense",
              "value": {
                "Id": 1,
                "Name": "quickStartProgram"
              },
              "for": "Ojjaara",
              "value":"ojjaaraQSP"
            }
          ]
        },
        {
          "name": "ojjaaraQSPPres",
          "label": "",
          "display": false,
          "value": "",
          "type": "prescription",
          "placeholder": "",
          "qty": 15,
          "refills": 14,
          "for": "Ojjaara"
        },
        {
          "name": "ojjaaraBridge",
          "value": "",
          "display": true,
          "label": "",
          "placeholder": "",
          "type": "checkbox",
          "validators": {},
          "for": "Ojjaara",
          "options": [
            {
              "label": "OJJAARA: Bridge Program",
              "subLabel": "For patients experiencing coverage interruptions while already on treatment",
              "value": {
                "Id": 1,
                "Name": "Bridge"
              },
              "for": "Ojjaara",
              "value":"ojjaaraBridge"

            }
          ]
        },
        {
          "name": "ojjaaraBridgePres",
          "label": "",
          "display": false,
          "value": "",
          "type": "prescription",
          "placeholder": "",
          "qty": 15,
          "refills": 14,
          "for": "Ojjaara"
        },
        {
          "name": "jemperliIV",
          "value": "",
          "display": true,
          "label": "",
          "placeholder": "",
          "type": "checkbox",
          "validators": {},
          "for": "Jemperli",
          "options": [
            {
              "label": "JEMPERLI IV",
              "value": {
                "Id": 1,
                "Name": ""
              },
              "for": "Jemperli",
              "value":"JemperliIV"
            }
          ]
        },
        {
          "name": "jemperliIVPres",
          "label": "",
          "display": false,
          "value": "",
          "type": "prescription",
          "placeholder": "",
          "qty": 15,
          "refills": 14,
          "for": "Jemperli"
        },
        {
          "type": "textarea",
          "name": "jemperliIVStrength",
          "display": false,
          "label": "Strength/Form",
          "disabled": true,
          "for": "Jemperli",
          "value": "Injection: clear to slightly opalescent, colorless to yellow solution supplied in a carton containing one 500 mg/10 mL (50 mg/mL), single-dose vial (NDC 0173-0898-03)."
        },
        {
          "type": "textarea",
          "display": false,
          "name": "jemperliIVDoa",
          "label": "Directions of Administration",
          "disabled": true,
          "for": "Jemperli",
          "value": "• Dose 1 through 4: 500 mg every 3 weeks.• Subsequent dosing beginning 3 weeks after Dose 4 (Dose5 onwards): 1000 mg every 6 weeks.• Administer as an intravenous infusion over 30 minutes."
        },
        {
          "name": "prescriptionSignature",
          "value": "",
          "display": true,
          "label": "Prescription Signature",
          "placeholder": "Select Prescription Signature",
          "type": "select",
          "for": "Zejula , Ojjaara ",
          "validators": { "required": true },
          "options": [
            {
              "label": "Dispense as written",
              "value": "Dispense as written"
            },
            {
              "label": "Substitute Permitted",
              "value": "Substitute Permitted"
            }
          ]
        }
      ]
    }
  }
// async function logJSONData(){
//     const response = await fetch("./b.json");
//     const jsonData = await response.json();
//     console.log(jsonData);
// }
// logJSONData();
const {html, ts} = generateReactiveForm(json);
const x = 11; // version
fs.writeFile(`sample${x}.html`, html, (err) => {
    if (err) throw err;
    console.log('HTML file has been saved!');
  });
fs.writeFile(`sample${x}.ts`, ts, (err) => {
if (err) throw err;
console.log('TS file has been saved!');
});
// console.log(html); // outputs the HTML code
// console.log(ts); // outputs the TypeScript code
