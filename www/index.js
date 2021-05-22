const wasm = import('../pkg')
  .catch(console.error);

const R = {
  line: ( ctx, x1, y1, x2, y2 ) => {
    ctx.beginPath();
    ctx.moveTo(x1,y1);
    ctx.lineTo(x2,y2);
    ctx.closePath();
    ctx.stroke();
  },
  circle: ( ctx, x, y, r, fill ) => {
    ctx.beginPath();
    ctx.arc( x, y, r, 0, Math.PI * 2, true );
    ctx.closePath();

    if( fill )
      ctx.fill();
    else
      ctx.stroke();
  },
  string: ( ctx, x, y, str ) => {
    ctx.fillText( str, x, y );
  },
};

Promise.all([wasm]).then(async function([{ parse_url, solve_numberlink }]) {
  const button = document.getElementById('button');

  button.innerText = 'Solve it!!!';

  button.onclick = () => { 
    const input = document.getElementById('url-box');
    
    const url = input.value;
    const field = JSON.parse(parse_url(url));
    const sol = JSON.parse(solve_numberlink(url));
  
    console.log(field);
  
    console.log(sol);
  
    if( field === '' || sol === '' ) {
      console.error('Solver Failed!!!');
  
      return;
    }
  
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
  
    const width = field[0].length;
    const height = field.length;
  
    const pad = 20;
    const scrW = 640, scrH = 480;
  
    const s = Math.min( (scrW-pad*2)/width, (scrH-pad*2)/height );
  
    ctx.clearRect(0, 0, scrW, scrH);
  
    for( let i = 0; i < height; ++i ) for( let j = 0; j < width; ++j ) {
      const x = pad + s*j;
      const y = pad + s*i;
  
      ctx.strokeStyle = 'rgb(40,40,40)';
      ctx.lineWidth = 2;
  
      ctx.strokeRect(x, y, s, s);
  
      if( field[i][j] != 0 ) {
        ctx.font = "normal 30px 'Yu Gothic'";

        if( field[i][j] < 10 )
          R.string(ctx, x+s/2-8, y+s/2+12, field[i][j] );
        else
          R.string(ctx, x+s/2-17, y+s/2+12, field[i][j] );
      }
    }
  
    const calc = i => pad + s*i + s/2;
  
    for( const arc of sol ) {
      ctx.strokeStyle = `rgb(40,40,40)`;
      ctx.lineWidth = 2;

      R.line( ctx, calc(arc[0][1]), calc(arc[0][0]), calc(arc[1][1]), calc(arc[1][0]) );
    }
  } 
});