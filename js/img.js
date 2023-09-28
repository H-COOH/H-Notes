let img,imgs,imgdb=new Database("img");

async function init_img()
{
	img={};
	imgs={};
	return new Promise(r=>
		imgdb.opendb().then(()=>
		{
			let s=localStorage.imglist;
			if(s===undefined)
				localStorage.imglist=aes.enc_data(s="");
			else
				s=aes.dec_data(s);
			let u="";
			for(let i=0; i<s.length; i++)
			{
				if(s[i]==="|")
					u+="/";
				else if(s[i]==="#")
				{
					let j=++i;
					while(s[i]!=="#")
						i++;
					img[u]=parseInt(s.slice(j,i));
					u="";
				}
				else
					u+=s[i];
			}
			r();
		}));
}