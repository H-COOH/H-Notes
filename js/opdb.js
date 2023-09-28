class Crypto
{
	key;

	constructor(){}

	check_key(key)
	{
		try
		{
			key=CryptoJS.AES.decrypt(localStorage.check_key,key).toString(CryptoJS.enc.Utf8);
			return md5(key)===localStorage.check_md5;
		}
		catch(e)
		{return false;}
	}

	enc_data=data=>CryptoJS.AES.encrypt(data,this.key).toString();

	dec_data=data=>CryptoJS.AES.decrypt(data,this.key).toString(CryptoJS.enc.Utf8);

	enc_db=data=>this.enc_data(JSON.stringify(data));

	dec_db=data=>JSON.parse(this.dec_data(data));
}

let aes=new Crypto();

class Database
{
	db;

	constructor(name)
	{this.name=name;}

	async opendb()
	{
		return new Promise(resolve=>
		{
			let request=indexedDB.open("database",1);
			request.onsuccess=()=>
			{
				this.db=request.result;
				resolve();
			};
			request.onupgradeneeded=e=>
			{
				this.db=e.target.result;
				this.db.createObjectStore("img",{autoIncrement:true});
				this.db.createObjectStore("note",{autoIncrement:true});
			};
		});
	}

	get_ob(f)
	{
		if(f)
			return this.db.transaction(this.name,"readwrite").objectStore(this.name);
		else
			return this.db.transaction(this.name).objectStore(this.name);
	}

	async readkeys()
	{return new Promise(r=>{this.db.transaction(this.name).objectStore(this.name).getAllKeys().onsuccess=e=>r(e.target.result);});}

	async readnote(key)
	{return new Promise(r=>{this.db.transaction(this.name).objectStore(this.name).get(key).onsuccess=e=>r(aes.dec_db(e.target.result));});}

	async addnote(note)
	{return new Promise(r=>{this.db.transaction(this.name,"readwrite").objectStore(this.name).add(aes.enc_db(note)).onsuccess=e=>r(e.target.result);});}

	async putnote(key,note)
	{return new Promise(r=>{this.db.transaction(this.name,"readwrite").objectStore(this.name).put(aes.enc_db(note),key).onsuccess=()=>r();});}

	async delnote(key)
	{return new Promise(r=>{this.db.transaction(this.name,"readwrite").objectStore(this.name).delete(key).onsuccess=()=>r();});}

	async delall()
	{return new Promise(r=>{this.db.transaction(this.name,"readwrite").objectStore(this.name).clear().onsuccess=()=>r();});}
}