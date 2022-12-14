const ASCIIArt = `
             .-')   .-. .-')               _ .-') _     ('-.        (\`-.         .-. .-')                                      
            ( OO ). \\  ( OO )             ( (  OO) )  _(  OO)     _(OO  )_       \\  ( OO )                                     
   .-----. (_)---\\_),--. ,--.,--.   ,--.\\     .'_ (,------.,--(_/   ,. \\       ;-----.\\  ,--.      .-'),-----.   ,----.     
  / ,-.   \\/    _ | |  .'   / \\  \`.'  / ,\`'--..._) |  .---'\\   \\   /(__/       | .-.  |  |  |.-') ( OO'  .-.  ' '  .-./-')  
  '-'  |  |\\  :\` \`. |      /   \\     /  |  |  \\  ' |  |     \\   \\ /   /        | '-' /_) |  | OO )/   |  | |  | |  |_( O- ) 
     .'  /  '..\`''.)|     /     \\   /   |  |   ' |(|  '--.   \\   '   /,        | .-. \`.  |  |\`-' |\\_) |  |\\|  | |  | .--, \\ 
   .'  /__ .-._)   \\|  .   \\    /  /    |  |   / : |  .--'    \\     /__)       | |  \\  |(|  '---.'  \\ |  | |  |(|  | '. (_/ 
  |       |\\       /|  |\\   \\  /  /     |  '--'  / |  \`---.    \\   /           | '--'  / |      |    \`'  '-'  ' |  '--'  |  
  \`-------' \`-----' \`--' '--' \`--'      \`-------'  \`------'     \`-'            \`------'  \`------'      \`-----'   \`------'   

`;

export function bootstrap() {
  console.log(
    '%c%s',
    'color:#E7B857;font-size:18px;',
    '🚧 ----------------------------------------------------------------------- 🚧',
  );
  console.log('%c%s', 'color:#E7B857;', ASCIIArt);
  console.log(
    '%c%s',
    'color:#E7B857;font-size:18px;',
    '🚧 ----------------------------------------------------------------------- 🚧',
  );
}
