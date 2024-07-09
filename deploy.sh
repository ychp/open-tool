#bash
set -e
npm run build
if [ -f "open-tool.tar.gz" ]; then
    # 删除文件
    rm open-tool.tar.gz
    echo "File $filename was deleted."
else
    echo "File $filename does not exist."
fi
tar -czvf open-tool.tar.gz dist
ssh tx 'sudo rm -rf /root/website/open-tool/dist /root/website/open-tool/open-tool.tar.gz'
scp ./open-tool.tar.gz root@tx:/root/website/open-tool/
ssh tx 'sudo tar -xzvf /root/website/open-tool/open-tool.tar.gz -C /root/website/open-tool/'
