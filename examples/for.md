# For attribute
- specify the name of the medicine in the form attribute in which you want to include that form field (control)!

```json
{
        "name": "treatmentStartDate",
        "value": "",
        "display": true,
        "label": "Treatment Start Date",
        "placeholder": "mm/dd/yyyy",
        "type": "date",
        "validators": {},
        "disabled": false,
        "for":"Zejula, Ojjaara"
      },

```
- if you do not specify the medicine inside for attrib. you get that form control in every medicine.

- we filter it in code.
```ts
data.currentLineOfTherapy.controls = data.currentLineOfTherapy.controls.filter((el:any)=>(!el.for || el.for.includes(this.enrollmentFormPayload.DrugGroup)));
```
