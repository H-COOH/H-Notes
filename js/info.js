let name,key2,info,data;
let ntdb=new Database("note");

async function load_info(mode)
{
	return new Promise(resolve=>
	{
		name=parseInt(sessionStorage[mode?"ntekey":"ntvkey"]);
		key2=ckey(name);
		ntdb.opendb().then(()=>
			ntdb.readnote(name).then(r=>
				{
					info=r["info"];
					data=r["data"];
					if(info==="")
					{
						let t=new Date(),s;
						s=String(t.getFullYear())+"/"+String(t.getMonth()+1).padStart(2,"0")+"/"+String(t.getDate()).padStart(2,"0");
						s+=" "+String(t.getHours()).padStart(2,"0")+":"+String(t.getMinutes()).padStart(2,"0");
						info={"make":s,"last":s,"edit":0,"read":false,"only":"","show":"","more":""};
						ntdb.putnote(name,{"info":info,"data":""});
					}
					resolve();
				}
			)
		);
	});
}

function ckey(n)
{
	n=String(n);
	let cookie=document.cookie.split(";");
	for(let i in cookie)
	{
		let u=cookie[i];
		while(u[0]===" ")
			u=u.slice(1);
		if(!u.indexOf(n+"="))
			return u.slice(n.length+2,-1);
	}
	return "";
}