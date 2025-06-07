$(document).ready(function() {
    let url = "";
    let myapi = "";
    const url1 = "https://nlpdata-5393.restdb.io/rest/"
    const url2 = "https://nlpdata2-9d3f.restdb.io/rest/"
    const myapi1 = "684301ad72702c6cc4b3d7d2";
    const myapi2 = "6843f2e8e22293a1177497af";

    url = url2;
    myapi = myapi2;
    // Sample data
    let soalData = [
 //       { nomor: 1, soal: "Apa penyebab utama pemanasan global?", jawabanIdeal: "Pemanasan global terutama disebabkan oleh emisi gas rumah kaca seperti karbon dioksida.", kataKunci: "pemanasan global, emisi, gas rumah kaca, karbon dioksida" },
 //       { nomor: 2, soal: "Sebutkan tiga dampak perubahan iklim!", jawabanIdeal: "Tiga dampak perubahan iklim adalah: 1) Meningkatnya suhu rata-rata bumi, 2) Mencairnya es di kutub, 3) Meningkatnya frekuensi bencana alam.", kataKunci: "perubahan iklim, suhu, es mencair, bencana alam" }
    ];

    let jawabanData = [
   //     { nomor: 1, nama: "Andi", jawaban: "Pemanasan global disebabkan oleh polusi karbon.", nilai: 80 },
   //     { nomor: 2, nama: "Budi", jawaban: "Perubahan iklim membuat cuaca ekstrim.", nilai: 75 }
    ];

    let temaUjian = [];

    const soalTable = $('#soal-table').DataTable({
            data: temaUjian,
            columns: [
                { data: 'id' },
                {data: 'tanggal'},
                { data: 'judul' },
                { data: 'deskripsi' },
            //{ data: 'Opsi' },
                { 
                    data: null,
                    render: function(data, type, row) {
                        return `
                            <button class="btn-action btn-look" data-id="${row.id}" data-judul="${row.judul}"><i class="fas fa-eye"></i> Lihat</button>
                            <button class="btn-action btn-edit" data-id="${row.id}" data-judul="${row.judul}"><i class="fas fa-edit"></i> Ubah</button>
                            <button class="btn-action btn-delete" data-id="${row.id}" data-api="${row._id}"><i class="fas fa-trash"></i> Hapus</button>
                        `;
                    }
                }
            ]
    });

    soalTable
    .on('order.dt search.dt', function () {
        let i = 1;
 
        soalTable
            .cells(null, 0, { search: 'applied', order: 'applied' })
            .every(function (cell) {
                this.data(i++);
            });
    })
    .draw();

    const soalRealTable = $('#soal-real-table').DataTable({
            data: soalData,
            columns: [
                { data: 'id' },
                { data: 'judul_soal' },
                { data: 'rincian' },
                { data: 'ideal' },
                { data: 'keyword' },
                { data: 'saran' },
                { data: 'nasihat' },
            //{ data: 'Opsi' },
                { 
                    data: null,
                    render: function(data, type, row) {
                        return `
                            <button class="btn-action btn-edit" data-id="${row.id}"><i class="fas fa-edit"></i> Ubah</button>
                            <button class="btn-action btn-delete" data-id="" data-api="${row._id}"><i class="fas fa-trash"></i> Hapus</button>
                        `;
                    }
                }
            ],
            order: [[1, 'desc']]
    });

    soalRealTable
    .on('order.dt search.dt', function () {
        let i = 1;
 
        soalRealTable
            .cells(null, 0, { search: 'applied', order: 'applied' })
            .every(function (cell) {
                this.data(i++);
            });
    })
    .draw();

    const jawabanTable = $('#jawaban-table').DataTable({
        data: jawabanData,
        columns: [
            { data: 'nomor' },
            { data: 'nama' },
            { data: 'jawaban' },
            { data: 'nilai' },
            { 
                data: null,
                render: function(data, type, row) {
                    return `
                        <button class="btn-action btn-edit" data-id="${row.nomor}"><i class="fas fa-edit"></i> Ubah</button>
                        <button class="btn-action btn-delete" data-id="${row.nomor}"><i class="fas fa-trash"></i> Hapus</button>
                    `;
                }
            }
        ]
    });

    // Update dashboard stats
    function updateStats() {
        $('#total-soal').text(soalData.length);
        $('#total-jawaban').text(jawabanData.length);
        
        const totalNilai = jawabanData.reduce((sum, item) => sum + item.nilai, 0);
        const rataNilai = jawabanData.length > 0 ? (totalNilai / jawabanData.length).toFixed(2) : 0;
        $('#rata-nilai').text(rataNilai);
    }

    updateStats();

    // Menu navigation
    $('.menu li').click(function() {
        $('.menu li').removeClass('active');
        $(this).addClass('active');
        
        const page = $(this).data('page');
        $('.page').removeClass('active');
        $(`#${page}-page`).addClass('active');
    });

    // fungsi untuk kembali
    $('#back').click(function(){
        $('.menu li').removeClass('active');
        //$(this).addClass('active');
        
        const page = $(this).data('page');
        $('.page').removeClass('active');
        $(`#soal-page`).addClass('active');
        
    });

    // Modal functionality
    const soalModal = $('#soal-modal');
    const jawabanModal = $('#jawaban-modal');
    const soalRealModal = $('#soal-real-modal');

    $('#tambah-soal').click(function() {
        soalModal.show();
    });

    $('#tambah-soal-real').click(function() {
        soalRealModal.show();
    });

    $('#tambah-jawaban').click(function() {
        jawabanModal.show();
    });

    $('.close').click(function() {
        soalModal.hide();
        jawabanModal.hide();
        soalRealModal.hide()
    });

    $(window).click(function(event) {
        if (event.target === soalModal[0]) {
            soalModal.hide();
        }
        if (event.target === jawabanModal[0]) {
            jawabanModal.hide();
        }
        if (event.target === soalRealModal[0]) {
            soalRealModal.hide();
        }
    });

    // Form submission
    $('#soal-form').submit(function(e) {
        e.preventDefault();
        
        let data = {
            id : 0,
            tanggal: $('#tanggal').val(),
            judul : $('#soal-text').val(),
            deskripsi : $('#jawaban-ideal').val(),
        };

        buatTema(data);

        soalModal.hide();

        // const newSoal = {
        //     nomor: soalData.length + 1,
        //     soal: $('#soal-text').val(),
        //     jawabanIdeal: $('#jawaban-ideal').val(),
        //     kataKunci: $('#kata-kunci').val()
        // };
        
        // soalData.push(newSoal);
        // soalTable.row.add(newSoal).draw();
        
        // $('#soal-text').val('');
        // $('#jawaban-ideal').val('');
        // $('#kata-kunci').val('');
        
        // soalModal.hide();
        // updateStats();
    });

    // Form submission
    $('#soal-real-form').submit(function(e) {
        e.preventDefault();
        
        let data = {
            id : 0,
            id_tema : $('#id-tema').val(),
            judul_soal : $('#judul-soal').val(),
            rincian : $('#rincian').val(),
            ideal : $('#ideal').val(),
            keyword : $('#keyword').val(),
            saran : $('#saran').val(),
            nasihat : $('#nasihat').val(),
        };

        buatSoal(data);
        //console.log(data);
        soalRealModal.hide();

        // const newSoal = {
        //     nomor: soalData.length + 1,
        //     soal: $('#soal-text').val(),
        //     jawabanIdeal: $('#jawaban-ideal').val(),
        //     kataKunci: $('#kata-kunci').val()
        // };
        
        // soalData.push(newSoal);
        // soalTable.row.add(newSoal).draw();
        
        // $('#soal-text').val('');
        // $('#jawaban-ideal').val('');
        // $('#kata-kunci').val('');
        
        // soalModal.hide();
        // updateStats();
    });

    $('#jawaban-form').submit(function(e) {
        e.preventDefault();
        
        const newJawaban = {
            nomor: jawabanData.length + 1,
            nama: $('#nama-peserta').val(),
            jawaban: $('#jawaban-peserta').val(),
            nilai: parseInt($('#nilai-peserta').val())
        };
        
        jawabanData.push(newJawaban);
        jawabanTable.row.add(newJawaban).draw();
        
        $('#nama-peserta').val('');
        $('#jawaban-peserta').val('');
        $('#nilai-peserta').val('');
        
        jawabanModal.hide();
        updateStats();
    });

    // Edit and delete functionality (sample)
    $(document).on('click', '.btn-delete', function() {
        const id = $(this).data('id');
        const _id = $(this).data('api')
        const tableId = $(this).closest('table').attr('id');
        
        if (confirm('Apakah Anda yakin ingin menghapus data ini?')) {
            if (tableId === 'soal-table') {
                temaUjian = temaUjian.filter(item => item._id !== _id);
                
                //console.log("hapus : " + id);
                temaDel(_id, temaUjian);
            }
            else if (tableId == 'soal-real-table') {
                soalData = soalData.filter(item => item._id !== _id);
                soalDel(_id, soalData);
                //soalRealTable.clear().rows.add(soalData).draw();
            }
            } else {
                jawabanData = jawabanData.filter(item => item.nomor !== id);
                jawabanTable.clear().rows.add(jawabanData).draw();
            }
            updateStats();
        }
    );

    // Edit functionality would be similjar but with a modal to edit existing data
    // This is a simplified version
    $(document).on('click', '.btn-edit', function() {
        alert('Fitur edit akan diimplementasikan di sini');
    });

    

    //fungsi filter pada table daftar soal
    function ambilSoalWhere(id_tema){
        if(soalData.length > 0){
            let tmp = soalData;
            tmp = tmp.filter(item => item.id_tema == id_tema);
            soalRealTable.clear().rows.add(tmp).draw();
        }

    }

    // menampilkan soal per ujian
    $(document).on('click', '.btn-look', function() {
        $('.page').removeClass('active');
        $('#soal-real').addClass('active');
        const judulUjian = $(this).data('judul');
        const idTema = $(this).data('id');
        $('#judul-ujian').text(judulUjian);
        $('#id-tema').val(idTema);
        ambilSoalWhere(idTema);
        
    });



    // fungsi untuk mengambil data judul ujian
    let settings = {
      "async": true,
      "crossDomain": true,
      "url": url + "tema",
      "method": "GET",  
      "headers": {
            "content-type": "application/json",
            "x-apikey": `${myapi}`,
            "cache-control": "no-cache"
      }
    }

    function ambilTema(){
        $.ajax(settings).done(function (response) {
            console.log(response)
            temaUjian = response;

            if(response.length > 0){
            soalTable.clear();
            soalTable.rows.add(temaUjian);
            soalTable.draw();
            }

        });
    }
    
    // fungsi untuk mengambil data soal
    let soalSet = {
      "async": true,
      "crossDomain": true,
      "url": url + "soal",
      "method": "GET",  
      "headers": {
            "content-type": "application/json",
            "x-apikey": `${myapi}`,
            "cache-control": "no-cache"
      }
    }

    function ambilSoal(){
        $.ajax(soalSet).done(function (response) {
            //console.log(response)
            soalData = response;

        });
    }

    //ambilTema()

    // fungsi untuk membuat data ujian
    function buatTema(data){
    let buatTemaSet = {
          "async": true,
          "crossDomain": true,
          "url": url + "tema",
          "method": "POST",
          "headers": {
            "content-type": "application/json",
            "x-apikey": `${myapi}`,
            "cache-control": "no-cache"
          },
          "processData": false,
          "data": JSON.stringify(data)
        }

    
        $.ajax(buatTemaSet).done(function (response) {
            console.log(response);
            ambilTema();
        });
    }

    // fungsi untuk membuat data soal
    function buatSoal(data){
    let buatSoalSet = {
          "async": true,
          "crossDomain": true,
          "url": url + "soal",
          "method": "POST",
          "headers": {
            "content-type": "application/json",
            "x-apikey": `${myapi}`,
            "cache-control": "no-cache"
          },
          "processData": false,
          "data": JSON.stringify(data)
        }

    
        $.ajax(buatSoalSet).done(function (response) {
            console.log(response);
             let tmp = soalData;
             tmp[tmp.length] = response;
             soalRealTable.clear().rows.add(tmp).draw();

            ambilSoal();
            // const idTema = parseInt($("#id-tema").val());
            // ambilSoalWhere(idTema);
        });
    }

    // fungsi untuk menghapus tema
    function temaDel(_id, updateTema){
    var temaDelSet = {
      "async": true,
      "crossDomain": true,
      "url": url + "tema/"+ _id,
      "method": "DELETE",
      "headers": {
        "content-type": "application/json",
        "x-apikey": myapi,
        "cache-control": "no-cache"
      }
    }

        $.ajax(temaDelSet).done(function (response) {
            console.log(response);
            soalTable.clear().rows.add(updateTema).draw();
            ambilTema();
        });
    }

    // untuk hapus soal
    function soalDel(_id, updateTable){
    let settings = {
    "async": true,
    "crossDomain": true,
    "url": url + "soal/" + _id,
    "method": "DELETE",
    "headers": {
            "content-type": "application/json",
            "x-apikey": myapi,
            "cache-control": "no-cache"
        }
    }

    $.ajax(settings).done(function (response) {
        console.log(response);
        soalRealTable.clear().rows.add(updateTable).draw();
    });
    }




    ambilTema();
    ambilSoal();
});