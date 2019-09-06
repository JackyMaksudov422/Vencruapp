export default function IsJSON(data){
    try{
        JSON.parse(data);
    } catch(e){
        return false;
    }
    return true;
}