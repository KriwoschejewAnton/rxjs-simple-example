import { of, fromEvent } from 'rxjs'; 
import { map, filter, tap, throttle, throttleTime, distinctUntilChanged,
debounceTime, mergeMap, catchError } from 'rxjs/operators';

const input = document.querySelector('#search-input');
const resultList = document.querySelector('#result-list');

const getDataFromWiki = (search) => {
 const url = `https://ru.wikipedia.org/w/api.php?&origin=*&action=opensearch&search=${ search }`;

 return fetch(url)
   .then(resp => resp.json());
}


const recordDataToList = (paragraphs) => {
  for (let i = 0; i < paragraphs.length; i++) {
    if (!resultList.children[i]) {
      const newEl = document.createElement('li');
      resultList.appendChild(newEl);
    }

    const li = resultList.children[i];
    li.innerHTML = paragraphs[i];
  }

  while (resultList.children.length > paragraphs.length) {
    resultList.removeChild(resultList.lastChild);
  }
}

fromEvent(input, 'keyup')
 .pipe(
   debounceTime(700),
   map(e => e.target.value),
   filter(text => text.length > 2),
   distinctUntilChanged(),
   mergeMap((val) => getDataFromWiki(val)),
   map(response => response[1])
 ).subscribe({
   next: recordDataToList,
   error: () => console.log('error')
});


of('Hello').pipe( map( v => v + "111" ) ).subscribe((vl) => console.log(vl));

 

