let fun;

function init_func()
{
	fun={};
	let r=localStorage.funlist;
	if(r===undefined)
	{
		r="#|N<h2 id=\"$\">$</h2>|/|N<i>$</i>|*|N<b>$</b>|?|N<del>$</del>|!|N<ins>$</ins>|c|Y<span style=\"color:@\">$</span>|";
		localStorage.funlist=aes.enc_data(r);
	}
	else
		r=aes.dec_data(r);
	let u="",v="",f;
	for(let i=0; i<r.length; i++)
	{
		if(r[i]==="|")
		{
			if(v==="")
			{
				v=u;
				u="";
				i++;
				f=r[i]==="Y";
			}
			else
			{
				fun[v]=[u,f];
				u=v="";
			}
		}
		else
			u+=r[i];
	}
}

function O(to,from)
{
	let all=to.split("\n");
	let re="",tr="",c=0;
	let flag=[],hide=0,uf=0;
	flag.push(0);
	for(let i=0; i<all.length; i++)
	{
		if(all[i][0]==="@")
		{
			if(all[i]==="@o")
			{
				flag.push(1);
				re+="<ul>";
			}
			else if(all[i]==="@n")
			{
				flag.push(2);
				re+="<ol>";
			}
			else if(all[i]==="@q")
			{
				flag.push(3);
				re+="<blockquote>";
			}
			else if(all[i]==="@x")
			{
				flag.push(4);
				hide++;
			}
			else if(all[i]==="@s")
				re+="<hr>";
			else if(all[i]==="@e")
			{
				uf=flag.pop();
				if(uf===1)
					re+="</ul>";
				if(uf===2)
					re+="</ol>";
				if(uf===3)
					re+="</blockquote>";
				if(uf===4)
					hide--;
				if(!flag.length)
					flag.push(0);
			}
			else
				re+="<br>";
			continue;
		}
		if(hide)
			continue;
		let res="";
		for(let j=0; j<all[i].length; j++)
		{
			if(all[i][j]==="{")
			{
				let k1="",k2="",k3="";
				for(j++; all[i][j]!=="|"&&j<all[i].length; j++)
					k1+=all[i][j];
				if(j<all[i].length-1&&all[i][j+1]==="(")
					for(j+=2; all[i][j]!==")"&&j<all[i].length; j++)
						k2+=all[i][j];
				for(j++; all[i][j]!=="}"&&j<all[i].length; j++)
					k3+=all[i][j];
				if(k1==="img")
					if(k3 in img)
						if(k3 in imgs)
							res+=`<img alt="${k3}" src="${imgs[k3]}" style="zoom:${k2}">`;
						else
							imgdb.readnote(img[k3]).then(o=>
							{
								imgs[k3]=o["data"];
								from();
							});
					else
						res+=`<img alt="找不到图片" src="" style="zoom:${k2}">`;
				else if(k1 in fun)
				{
					if(fun[k1][1])
						res+=fun[k1][0].replaceAll("@",k2).replaceAll("$",k3);
					else
						res+=fun[k1][0].replaceAll("$",k3);
					if(k1==="#")
						tr+=`<li><a href="#${k3}">${k3}</a></li>`;
				}
				else
					res+=k3;
				if(k1!=="img")
					c+=k3.length;
			}
			else if(all[i][j]==="$"&&j<all[i].length-1&&all[i][j+1]==="#")
			{
				let ux="";
				j+=2;
				for(; (all[i][j-1]==="\\"||all[i][j]!=="#")&&j<all[i].length; j++)
					ux+=all[i][j];
				res+=katex.renderToString(ux,{throwOnError:false});
			}
			else if(all[i][j]==="\\")
			{
				if(j<all[i].length-1)
				{
					j++;
					res+=all[i][j];
					c++;
				}
			}
			else
			{
				if(all[i][j]==="<"||all[i][j]===">")
					res+=all[i][j]==="<"?"&lt;":"&gt;";
				else
					res+=all[i][j];
				c++;
			}
		}
		uf=flag[flag.length-1];
		if(uf===0||uf===3)
			re+="<p>"+res+"</p>";
		if(uf===1||uf===2)
			re+="<li>"+res+"</li>";
	}
	return [re,tr,c];
}