﻿using System;
using System.Windows.Forms;
namespace WindowsApplication1
{
    public partial class Form1 : Form
    {
        public Form1()
        { InitializeComponent(); }
        private void button1_Click(object sender, EventArgs e)
        {
            //this.Text = this.textBox1.Text;
            int a = Int32.Parse(textBox1.Text);
            a = a * 2;
            this.textBox1.Text = a.ToString();
            //textBox1.Focus();
            // this.textBox1.Text= textBox1.ContainsFocus.ToString();


        }
    }
}
