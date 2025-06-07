
        let home = "";
        let home_head = "";
        let artikel = "";
        let kepala = document.getElementById('head');
        let utama = document.getElementById('utama');
        
        let kepalaBackup = kepala.innerHTML;
        let utamaBackup = utama.innerHTML;
        let url = "https://cobadb-b79a.restdb.io/rest/blog";
        function param(met, data){
          this.mode = "cors",
          this.headers = {
            "content-type" : "application/json;charset=utf-8",
            "x-apikey" : "60a69606e3b6e02545edaadc",
            "cache-control" : "no-cache"
          },
          this.body = data,
          this.method = met
        }
        let getParam = new param("GET",null);
        //getData
        fetch(url, getParam)
        .then((res) => res.json())
        .then((data) => {
          document.getElementById("ttg").addEventListener('click',tentang);
          console.log("true");
          console.log(JSON.stringify(data))
          document.getElementById('isi').innerHTML = `
          
          `;
          let count = 0;
          //console.log(data[0]);
          for(ls of data){
            
            //console.log(ls['judul']);
              document.getElementById('isi').innerHTML += `<!-- Post preview-->
                    <div class="post-preview">
                        <a href="javascript:baca(artikel[${count}]);">
                        <h2 id="${ls.id}" class="post-title">${ls.judul}</h2>
                        
<h3 class="post-subtitle">${ls.sub}</h3>
                        
                        </a>
                        <p class="post-meta">
                            Diposting oleh
                            <a href="#!">${ls.penulis}</a>
                            pada ${ls.tanggal}
                        </p>
                    </div>
                    <!-- Divider-->
                    <hr class="my-4" />
                    `;
                    ++count;
                    //document.getElementById(ls.id).addEventListener('dblclick',baca(e));
          }
          artikel = data;
          kepalaBackup = kepala.innerHTML;
          utamaBackup = utama.innerHTML;
          
        })
        .catch( e => console.log(e.toString()));
        function beranda(){
          kepala.innerHTML = kepalaBackup;
          kepala.style.backgroundImage = "url('assets/img/home-bg.jpg')";
          utama.innerHTML = utamaBackup;
        }
        
          function tentang(){
          let main_isi = `
<div class="container px-4 px-lg-5">
                <div class="row gx-4 gx-lg-5 justify-content-center">
                    <div class="col-md-10 col-lg-8 col-xl-7">
<div class="text-center">                    
<p>Universitas Bina Sarana Informatika <br /> Karawang Kampus Cikampek</p>
<hr class="my-2" />
</div>
                       <p>Mustoni (12183492)</p>
                       <p>Deni Sopandi (12182741)</p>
                       <p>Afzal Azkhari (12182042)</p>
                       <p>Riska Maulidiyah (12180032)</p>
                       <p>Diana Agustiani (12180767)</p>
                       </div>
                </div>
            </div>
          `;
          let head_isi = `
<div class="container position-relative px-4 px-lg-5">
                <div class="row gx-4 gx-lg-5 justify-content-center">
                    <div class="col-md-10 col-lg-8 col-xl-7">
                        <div class="page-heading">
                            <h1>Kami</h1>
                            <span class="subheading">Anggota Kelompok Ini</span>
                        </div>
                    </div>
                </div>
            </div>
          `;
          kepala.style.backgroundImage="url('assets/img/about-bg.jpg')";
          kepala.innerHTML = head_isi;
          utama.innerHTML = main_isi;
          
          }
          
          function baca(data){
            home_head = kepala.innerHTML;
            home = utama.innerHTML;
            kepala.innerHTML = `
 <div class="container position-relative px-4 px-lg-5">
                <div class="row gx-4 gx-lg-5 justify-content-center">
                    <div class="col-md-10 col-lg-8 col-xl-7">
                        <div class="post-heading">
                            <h1>${data.judul}</h1>
                            
<h2 class="subheading">${data.sub}</h2>
                            
                            
                            <span class="meta">
                                Diposting oleh
                                <a href="#!">${data.penulis}</a>
                                pada ${data.tanggal}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            `;
            
            utama.innerHTML = `
        <article class="mb-4">
            <div class="container px-4 px-lg-5">
                <div class="row gx-4 gx-lg-5 justify-content-center">
                    <div class="col-md-10 col-lg-8 col-xl-7">${data.content}
                    </div>
                </div>
              </div>
        </article>
          <!-- Divider-->
                    <hr class="my-4" />
                    <!-- Pager-->
                    <div class="d-flex justify-content-center mb-4"><a class="btn btn-danger text-lowercase" href="#!" onclick="rumah()">Tutup</a></div>
            `;
            
          }
          
          function rumah(){
            kepala.innerHTML = home_head;
            utama.innerHTML = home;
          }
        