$WORKSPACE = Join-Path $PSScriptRoot ".." -Resolve

$PROTOS_PATH = "https://raw.github.com/lokomotes/metro/master/api/proto/"
$PROTOS = "common.proto", "router.proto"

$JS_DST = "$WORKSPACE\dist\api\"
$TS_DST = "$WORKSPACE\src\api\"
$PROTOC_NODE_PLUGIN_PATH = "$WORKSPACE\node_modules\.bin\grpc_tools_node_protoc_plugin.cmd"
$PROTOC_GEN_TS_PATH = "$WORKSPACE\node_modules\.bin\protoc-gen-ts.cmd"

if($null -eq (Get-Command protoc.exe -ErrorAction SilentlyContinue)){
    Write-Error "Failed to get protoc.exe. Please install protoc.exe or add to PATH if you already have one."
    Break
}

if(!(Test-Path $PROTOC_NODE_PLUGIN_PATH) -or !(Test-Path $PROTOC_GEN_TS_PATH)){
    Write-Error "Dev tools not exist. Did you do 'npm install'? "
    Break
}

Get-ChildItem -Path $JS_DST -File | ForEach-Object {$_.Delete()}
Get-ChildItem -Path $TS_DST -File | ForEach-Object {$_.Delete()}

$SRC_TMP = New-TemporaryFile | ForEach-Object { Remove-Item $_; New-Item -ItemType Directory -Path $_ }
$OUT_TMP = New-TemporaryFile | ForEach-Object { Remove-Item $_; New-Item -ItemType Directory -Path $_ }

foreach($proto in $PROTOS){
    Invoke-WebRequest -Uri $PROTOS_PATH$proto -OutFile $(Join-Path $SRC_TMP $proto)
}

protoc.exe `
    --proto_path=$SRC_TMP `
    --grpc_out=$OUT_TMP `
    --js_out="import_style=commonjs,binary:$OUT_TMP" `
    --ts_out="$OUT_TMP" `
    --plugin="protoc-gen-grpc=$PROTOC_NODE_PLUGIN_PATH" `
    --plugin="protoc-gen-ts=$PROTOC_GEN_TS_PATH" `
$(Get-Item $SRC_TMP\*.proto)

Move-Item $OUT_TMP\*.js $JS_DST
Move-Item $OUT_TMP\*.ts $TS_DST

Remove-Item $SRC_TMP -Confirm:$false -Force -Recurse
Remove-Item $OUT_TMP -Confirm:$false -Force -Recurse