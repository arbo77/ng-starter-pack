import module from './module'


module.run(['$rootScope',
  function ($rootScope) {

    let $ = $rootScope;
    $.api = {
      sync: true,
    }
    $.data = {
      counter: 1,
    }

    const db = new Dexie("app");

    db.version(1).stores({
        objects: 'id, type'
    });

    db.on('changes', function (changes) {
      changes.forEach(function (change) {
        let key
        if(change.type === 1) {
          key = change.obj.type + "s"
        }else{
          key = change.oldObj.type + "s"
        }
        switch (change.type) {
          case 1: // CREATED
           
            if ($.data[key] === undefined) {
              $.data[key] = []
            }
            const isLive = (!$.api.sync || change.obj.id === undefined) && typeof $.api.put === 'function'
            console.log($.api.sync, change.obj.id === undefined, typeof $.api.put === 'function' )
            console.log(isLive)
            if(!isLive){
              $.data[key].push(Object.assign(change.obj, {id: change.key}))
              $.$evalAsync()
            }else{
              if(change.obj.id === undefined) {
                $.api.put(change.obj, (resp)=>{
                  if(resp.id) {
                    db[change.table].delete(change.key)
                    db[change.table].put(resp)
                  }
                })
              }             
            }
            
            break;
          case 2: // UPDATED            
            $.data[key].forEach(el=>{
              if(el.id === change.key){
                Object.assign(el, change.obj)
                $.$evalAsync()

                if($.api.sync) {
                  $.api.put(change.obj, (resp)=>{
                  })
                }
                return;
              }
            })
            
            break;

          case 3: // DELETED
            $.data[key].forEach(el=>{
              if(el.id === change.key){
                const idx = $.data[key].indexOf(el)
                $.data[key].splice(idx,1)
                $.$evalAsync()

                if($.api.sync) {
                  $.api.del({
                    id: el.id
                  }, (resp)=>{
                  })
                }
                return;
              }
            })
            break;
        }
      })
    })
    
    db.open()

    db.objects.toArray().then(function(row){
      row.forEach(function(el){
        const key = el.type + "s"
        if ($.data[key] === undefined) {
          $.data[key] = []
        }
        $.data[key].push(el)
        $.$evalAsync()
      })
    })

    window.db = db;

    $.inc = function() {
      $.data.counter++;
    }
  }
])
